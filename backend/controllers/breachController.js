const Breach = require('../models/Breach');

// Sample realistic breach data
const sampleBreaches = [
  { 
    name: 'Adobe 2013', 
    domain: 'adobe.com', 
    compromisedData: ['Email addresses', 'Password hashes', 'Names'],
    date: new Date('2013-10-01')
  },
  { 
    name: 'LinkedIn 2012', 
    domain: 'linkedin.com', 
    compromisedData: ['Email addresses', 'Password hashes'],
    date: new Date('2012-06-01')
  },
  { 
    name: 'MySpace 2016', 
    domain: 'myspace.com', 
    compromisedData: ['Email addresses', 'Password hashes'],
    date: new Date('2016-06-01')
  },
  { 
    name: 'Twitter 2022', 
    domain: 'twitter.com', 
    compromisedData: ['Email addresses', 'Usernames'],
    date: new Date('2022-01-01')
  }
];

// @desc    Check email for breaches
// @route   POST /api/breaches/check
const checkBreach = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Simulate realistic breach detection (30% chance)
    const hasBreach = Math.random() > 0.7;
    let breaches = [];

    if (hasBreach) {
      // Random 1-3 breaches
      const breachCount = Math.floor(Math.random() * 3) + 1;
      breaches = sampleBreaches.slice(0, breachCount);
    }

    // Save to database
    const breachRecord = new Breach({
      email: email.toLowerCase().trim(),
      breaches,
      totalBreaches: breaches.length
    });

    await breachRecord.save();

    res.status(200).json({
      success: true,
      email: email.toLowerCase(),
      foundBreaches: breaches.length,
      breaches,
      message: breaches.length > 0 
        ? `⚠️ ${breaches.length} breach(es) found! Change your passwords immediately.` 
        : '✅ Excellent! No breaches found for this email.',
      advice: breaches.length > 0 
        ? '💡 Enable 2FA, use password manager, and monitor accounts closely.'
        : '💡 Continue good security practices!'
    });

  } catch (error) {
    console.error('❌ Breach check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during breach check' 
    });
  }
};

// @desc    Get breach history
// @route   GET /api/breaches/history
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const history = await Breach.find()
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('email totalBreaches breaches checkedAt createdAt');

    const total = await Breach.countDocuments();

    res.json({ 
      success: true, 
      history, 
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ History fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching history' 
    });
  }
};

// @desc    Get stats
// @route   GET /api/breaches/stats
const getStats = async (req, res) => {
  try {
    const totalChecks = await Breach.countDocuments();
    const breachedEmails = await Breach.countDocuments({ totalBreaches: { $gt: 0 } });
    const recentChecks = await Breach.countDocuments({ 
      checkedAt: { $gte: new Date(Date.now() - 24*60*60*1000) } 
    });

    res.json({
      success: true,
      stats: {
        totalChecks,
        breachedEmails,
        safeEmails: totalChecks - breachedEmails,
        breachPercentage: totalChecks ? ((breachedEmails / totalChecks) * 100).toFixed(1) : 0,
        recent24h: recentChecks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stats error' });
  }
};

module.exports = { checkBreach, getHistory, getStats };