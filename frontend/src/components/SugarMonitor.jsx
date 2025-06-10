import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Droplets, Plus, TrendingUp, Calendar, Clock, AlertTriangle } from 'lucide-react';

const BloodSugarMonitor = () => {
  const [readings, setReadings] = useState([
    {
      id: 1,
      date: '2025-06-01',
      time: '08:00',
      glucose: 95,
      testType: 'fasting',
      notes: 'Morning fasting'
    },
    {
      id: 2,
      date: '2025-06-01',
      time: '14:30',
      glucose: 140,
      testType: 'after-meal',
      notes: 'After lunch'
    },
    {
      id: 3,
      date: '2025-06-02',
      time: '07:45',
      glucose: 88,
      testType: 'fasting',
      notes: 'Morning fasting'
    },
    {
      id: 4,
      date: '2025-06-02',
      time: '20:00',
      glucose: 125,
      testType: 'after-meal',
      notes: 'After dinner'
    },
    {
      id: 5,
      date: '2025-06-03',
      time: '08:15',
      glucose: 92,
      testType: 'fasting',
      notes: 'Morning fasting'
    }
  ]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    glucose: '',
    testType: 'fasting',
    notes: ''
  });

  const [showForm, setShowForm] = useState(false);

  const testTypes = [
    { value: 'fasting', label: 'Fasting (8+ hours)' },
    { value: 'before-meal', label: 'Before Meal' },
    { value: 'after-meal', label: 'After Meal (2 hours)' },
    { value: 'bedtime', label: 'Bedtime' },
    { value: 'random', label: 'Random' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.date && formData.glucose && formData.testType) {
      const newReading = {
        id: Date.now(),
        date: formData.date,
        time: formData.time,
        glucose: parseInt(formData.glucose),
        testType: formData.testType,
        notes: formData.notes
      };
      
      setReadings(prev => [...prev, newReading].sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)));
      setFormData({
        date: '',
        time: '',
        glucose: '',
        testType: 'fasting',
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
    glucose: reading.glucose,
    testType: reading.testType,
    fullDate: reading.date,
    notes: reading.notes,
    label: `${new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${reading.time}`
  }));

  // Calculate statistics
  const avgGlucose = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.glucose, 0) / readings.length) : 0;
  const latestReading = readings[readings.length - 1];
  
  // Separate fasting and post-meal readings
  const fastingReadings = readings.filter(r => r.testType === 'fasting');
  const postMealReadings = readings.filter(r => r.testType === 'after-meal');
  
  const avgFasting = fastingReadings.length > 0 ? Math.round(fastingReadings.reduce((sum, r) => sum + r.glucose, 0) / fastingReadings.length) : 0;
  const avgPostMeal = postMealReadings.length > 0 ? Math.round(postMealReadings.reduce((sum, r) => sum + r.glucose, 0) / postMealReadings.length) : 0;

  const getGlucoseCategory = (glucose, testType) => {
    if (testType === 'fasting') {
      if (glucose < 70) return { category: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' };
      if (glucose <= 99) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' };
      if (glucose <= 125) return { category: 'Prediabetes', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' };
      return { category: 'Diabetes', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' };
    } else if (testType === 'after-meal') {
      if (glucose < 70) return { category: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' };
      if (glucose <= 139) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' };
      if (glucose <= 199) return { category: 'Prediabetes', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' };
      return { category: 'Diabetes', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' };
    } else {
      if (glucose < 70) return { category: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' };
      if (glucose <= 140) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' };
      if (glucose <= 199) return { category: 'Elevated', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' };
      return { category: 'High', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' };
    }
  };

  const getTestTypeColor = (testType) => {
    const colors = {
      'fasting': '#3b82f6',
      'before-meal': '#10b981',
      'after-meal': '#f59e0b',
      'bedtime': '#8b5cf6',
      'random': '#ef4444'
    };
    return colors[testType] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold">{`${data.date} at ${data.time}`}</p>
          <p className="text-blue-600 font-medium">{`Glucose: ${data.glucose} mg/dL`}</p>
          <p className="text-gray-600 capitalize">{`Type: ${data.testType.replace('-', ' ')}`}</p>
          {data.notes && <p className="text-gray-500 text-sm mt-1">{data.notes}</p>}
        </div>
      );
    }
    return null;
  };

  // Count readings by type for summary
  const readingsByType = testTypes.reduce((acc, type) => {
    acc[type.value] = readings.filter(r => r.testType === type.value).length;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Blood Sugar Monitor</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Reading
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Average</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">{avgGlucose}</p>
            <p className="text-sm text-blue-700">mg/dL</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Avg Fasting</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">{avgFasting || '-'}</p>
            <p className="text-sm text-green-700">mg/dL</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Avg Post-Meal</h3>
            </div>
            <p className="text-2xl font-bold text-orange-900">{avgPostMeal || '-'}</p>
            <p className="text-sm text-orange-700">mg/dL</p>
          </div>

          {latestReading && (
            <div className={`p-4 rounded-lg border ${getGlucoseCategory(latestReading.glucose, latestReading.testType).bgColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Latest</h3>
              </div>
              <p className="text-2xl font-bold text-purple-900">{latestReading.glucose}</p>
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Glucose Level (mg/dL) *</label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="40"
                  max="600"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {testTypes.map(type => (
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
                  placeholder="e.g., felt dizzy, after exercise, forgot medication"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Reference Ranges */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Normal Blood Sugar Ranges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-700">Fasting (8+ hours)</p>
              <p className="text-blue-600">Normal: 70-99 mg/dL</p>
              <p className="text-blue-600">Prediabetes: 100-125 mg/dL</p>
            </div>
            <div>
              <p className="font-medium text-blue-700">After Meals (2 hours)</p>
              <p className="text-blue-600">Normal: &lt;140 mg/dL</p>
              <p className="text-blue-600">Prediabetes: 140-199 mg/dL</p>
            </div>
            <div>
              <p className="font-medium text-blue-700">Random</p>
              <p className="text-blue-600">Normal: &lt;140 mg/dL</p>
              <p className="text-blue-600">Diabetes: ≥200 mg/dL</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Blood Sugar Trends</h2>
          <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    domain={[60, 'dataMax + 20']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {/* Reference lines */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 70} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Normal Low (70)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 140} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Normal High (140)"
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="glucose" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={4} 
                          fill={getTestTypeColor(payload.testType)}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    name="Glucose Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No readings yet. Add your first reading to see the chart.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Readings Summary by Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Readings by Type</h3>
            <div className="space-y-2">
              {testTypes.map(type => (
                <div key={type.value} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="capitalize text-gray-700">{type.label}</span>
                  <span className="font-semibold text-gray-900">{readingsByType[type.value] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Alerts</h3>
            <div className="space-y-2">
              {readings.slice(-5).reverse().filter(r => r.glucose < 70 || r.glucose > 180).map(reading => {
                const category = getGlucoseCategory(reading.glucose, reading.testType);
                return (
                  <div key={reading.id} className={`p-2 rounded border ${category.bgColor}`}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {reading.glucose} mg/dL - {new Date(reading.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              {readings.filter(r => r.glucose < 70 || r.glucose > 180).length === 0 && (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glucose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.slice().reverse().map((reading) => {
                  const category = getGlucoseCategory(reading.glucose, reading.testType);
                  return (
                    <tr key={reading.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reading.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.time || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {reading.glucose} mg/dL
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {reading.testType.replace('-', ' ')}
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

export default BloodSugarMonitor;