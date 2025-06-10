import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Heart, Plus, TrendingUp, Calendar, Activity, AlertCircle } from 'lucide-react';

const HeartRateMonitor = () => {
  const [readings, setReadings] = useState([
    {
      id: 1,
      date: '2025-06-01',
      time: '08:00',
      pulse: 68,
      activity: 'resting',
      notes: 'Morning resting rate'
    },
    {
      id: 2,
      date: '2025-06-01',
      time: '15:30',
      pulse: 95,
      activity: 'walking',
      notes: 'After 10-minute walk'
    },
    {
      id: 3,
      date: '2025-06-02',
      time: '07:45',
      pulse: 72,
      activity: 'resting',
      notes: 'Morning resting'
    },
    {
      id: 4,
      date: '2025-06-02',
      time: '18:00',
      pulse: 145,
      activity: 'exercise',
      notes: 'After 30min cardio'
    },
    {
      id: 5,
      date: '2025-06-03',
      time: '08:15',
      pulse: 70,
      activity: 'resting',
      notes: 'Morning resting'
    },
    {
      id: 6,
      date: '2025-06-03',
      time: '14:20',
      pulse: 88,
      activity: 'walking',
      notes: 'Climbing stairs'
    }
  ]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pulse: '',
    activity: 'resting',
    notes: ''
  });

  const [showForm, setShowForm] = useState(false);

  const activityTypes = [
    { value: 'resting', label: 'Resting', color: '#10b981' },
    { value: 'walking', label: 'Walking', color: '#3b82f6' },
    { value: 'exercise', label: 'Exercise', color: '#f59e0b' },
    { value: 'running', label: 'Running', color: '#ef4444' },
    { value: 'stressed', label: 'Stressed/Anxious', color: '#8b5cf6' },
    { value: 'sleeping', label: 'Sleeping', color: '#06b6d4' },
    { value: 'other', label: 'Other', color: '#6b7280' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.date && formData.pulse) {
      const newReading = {
        id: Date.now(),
        date: formData.date,
        time: formData.time,
        pulse: parseInt(formData.pulse),
        activity: formData.activity,
        notes: formData.notes
      };
      
      setReadings(prev => [...prev, newReading].sort((a, b) => new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00'))));
      setFormData({
        date: '',
        time: '',
        pulse: '',
        activity: 'resting',
        notes: ''
      });
      setShowForm(false);
    }
  };

  // Prepare chart data
  const chartData = readings.map((reading, index) => ({
    id: index,
    date: new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: reading.time,
    pulse: reading.pulse,
    activity: reading.activity,
    fullDate: reading.date,
    notes: reading.notes,
    label: `${new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${reading.time || ''}`
  }));

  // Calculate statistics
  const avgPulse = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.pulse, 0) / readings.length) : 0;
  const latestReading = readings[readings.length - 1];
  
  // Separate by activity type
  const restingReadings = readings.filter(r => r.activity === 'resting');
  const exerciseReadings = readings.filter(r => ['exercise', 'running'].includes(r.activity));
  
  const avgResting = restingReadings.length > 0 ? Math.round(restingReadings.reduce((sum, r) => sum + r.pulse, 0) / restingReadings.length) : 0;
  const maxPulse = readings.length > 0 ? Math.max(...readings.map(r => r.pulse)) : 0;
  const minPulse = readings.length > 0 ? Math.min(...readings.map(r => r.pulse)) : 0;

  const getHeartRateCategory = (pulse, activity) => {
    if (pulse < 60 && activity === 'resting') {
      return { category: 'Bradycardia', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', desc: 'Slow heart rate' };
    }
    if (pulse > 100 && activity === 'resting') {
      return { category: 'Tachycardia', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', desc: 'Fast resting rate' };
    }
    if (activity === 'resting') {
      return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', desc: 'Normal resting rate' };
    }
    if (activity === 'exercise' || activity === 'running') {
      if (pulse > 180) {
        return { category: 'Very High', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', desc: 'Very high exercise rate' };
      }
      if (pulse > 150) {
        return { category: 'High Intensity', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', desc: 'High intensity' };
      }
      return { category: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', desc: 'Moderate exercise' };
    }
    return { category: 'Active', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', desc: 'Active state' };
  };

  const getActivityColor = (activity) => {
    const activityType = activityTypes.find(a => a.value === activity);
    return activityType ? activityType.color : '#6b7280';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const category = getHeartRateCategory(data.pulse, data.activity);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold">{`${data.date} ${data.time ? `at ${data.time}` : ''}`}</p>
          <p className="text-red-500 font-medium">{`Heart Rate: ${data.pulse} BPM`}</p>
          <p className="text-gray-600 capitalize">{`Activity: ${data.activity}`}</p>
          <p className={`text-sm ${category.color}`}>{category.desc}</p>
          {data.notes && <p className="text-gray-500 text-sm mt-1">{data.notes}</p>}
        </div>
      );
    }
    return null;
  };

  // Count readings by activity
  const readingsByActivity = activityTypes.reduce((acc, type) => {
    acc[type.value] = readings.filter(r => r.activity === type.value).length;
    return acc;
  }, {});

  // Heart rate zones (based on age - using general 30-year-old example)
  const maxHR = 190; // 220 - 30 (age)
  const zones = {
    recovery: Math.round(maxHR * 0.6),
    aerobic: Math.round(maxHR * 0.7),
    anaerobic: Math.round(maxHR * 0.8),
    maximum: Math.round(maxHR * 0.9)
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">Heart Rate Monitor</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Reading
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Average</h3>
            </div>
            <p className="text-2xl font-bold text-red-900">{avgPulse}</p>
            <p className="text-sm text-red-700">BPM</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Resting Avg</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">{avgResting || '-'}</p>
            <p className="text-sm text-green-700">BPM</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Range</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">{minPulse}-{maxPulse}</p>
            <p className="text-sm text-blue-700">BPM</p>
          </div>

          {latestReading && (
            <div className={`p-4 rounded-lg border ${getHeartRateCategory(latestReading.pulse, latestReading.activity).bgColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Latest</h3>
              </div>
              <p className="text-2xl font-bold text-purple-900">{latestReading.pulse}</p>
              <p className="text-sm text-purple-700">{new Date(latestReading.date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Add Reading Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (BPM) *</label>
                <input
                  type="number"
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleInputChange}
                  placeholder="72"
                  min="30"
                  max="220"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity *</label>
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g., felt chest pain, after coffee, during meditation"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Reading
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Heart Rate Zones */}
        <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
          <h3 className="font-semibold text-red-800 mb-3">Heart Rate Zones (Example for 30 years old)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-green-100 p-2 rounded">
              <p className="font-medium text-green-700">Recovery Zone</p>
              <p className="text-green-600">50-60%: &lt;{zones.recovery} BPM</p>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-medium text-blue-700">Aerobic Zone</p>
              <p className="text-blue-600">60-70%: {zones.recovery}-{zones.aerobic} BPM</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded">
              <p className="font-medium text-yellow-700">Anaerobic Zone</p>
              <p className="text-yellow-600">70-80%: {zones.aerobic}-{zones.anaerobic} BPM</p>
            </div>
            <div className="bg-red-100 p-2 rounded">
              <p className="font-medium text-red-700">Maximum Zone</p>
              <p className="text-red-600">80-90%: {zones.anaerobic}-{zones.maximum} BPM</p>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">*Zones calculated using 220 - age formula. Consult your doctor for personalized zones.</p>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Heart Rate Trends</h2>
          <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label" 
                    stroke="#666"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {/* Reference lines for heart rate zones */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 60} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Normal Resting (60)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 100} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Tachycardia (100)"
                  />
                  
                  <Area
                    type="monotone"
                    dataKey="pulse"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="url(#pulseGradient)"
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={5} 
                          fill={getActivityColor(payload.activity)}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    name="Heart Rate (BPM)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No readings yet. Add your first reading to see the chart.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary and Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Readings by Activity</h3>
            <div className="space-y-2">
              {activityTypes.map(type => (
                <div key={type.value} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className="text-gray-700">{type.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{readingsByActivity[type.value] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Alerts</h3>
            <div className="space-y-2">
              {readings.slice(-5).reverse().filter(r => 
                (r.pulse < 60 && r.activity === 'resting') || 
                (r.pulse > 100 && r.activity === 'resting') || 
                r.pulse > 180
              ).map(reading => {
                const category = getHeartRateCategory(reading.pulse, reading.activity);
                return (
                  <div key={reading.id} className={`p-2 rounded border ${category.bgColor}`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {reading.pulse} BPM - {category.category} - {new Date(reading.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              {readings.filter(r => 
                (r.pulse < 60 && r.activity === 'resting') || 
                (r.pulse > 100 && r.activity === 'resting') || 
                r.pulse > 180
              ).length === 0 && (
                <p className="text-gray-500 text-sm">No recent alerts</p>
              )}
            </div>
          </div>
        </div>

        {/* Readings Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Readings</h2>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.slice().reverse().map((reading) => {
                  const category = getHeartRateCategory(reading.pulse, reading.activity);
                  return (
                    <tr key={reading.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reading.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.time || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {reading.pulse} BPM
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getActivityColor(reading.activity) }}
                          ></div>
                          <span className="capitalize">{reading.activity}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${category.color}`}>
                        {category.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {readings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No readings recorded yet. Click "Add Reading" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;