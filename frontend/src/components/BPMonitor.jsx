import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heart, Plus, TrendingUp, Calendar, Clock } from 'lucide-react';

const BloodPressureMonitor = () => {
  const [readings, setReadings] = useState([
    {
      id: 1,
      date: '2025-06-01',
      time: '08:00',
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      notes: 'Morning reading'
    },
    {
      id: 2,
      date: '2025-06-02',
      time: '19:30',
      systolic: 125,
      diastolic: 82,
      pulse: 75,
      notes: 'After dinner'
    },
    {
      id: 3,
      date: '2025-06-03',
      time: '07:45',
      systolic: 118,
      diastolic: 78,
      pulse: 70,
      notes: 'Before medication'
    }
  ]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    systolic: '',
    diastolic: '',
    pulse: '',
    notes: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.date && formData.systolic && formData.diastolic) {
      const newReading = {
        id: Date.now(),
        date: formData.date,
        time: formData.time,
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
        pulse: formData.pulse ? parseInt(formData.pulse) : null,
        notes: formData.notes
      };
      
      setReadings(prev => [...prev, newReading].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setFormData({
        date: '',
        time: '',
        systolic: '',
        diastolic: '',
        pulse: '',
        notes: ''
      });
      setShowForm(false);
    }
  };

  // Prepare chart data
  const chartData = readings.map(reading => ({
    date: new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    systolic: reading.systolic,
    diastolic: reading.diastolic,
    pulse: reading.pulse,
    fullDate: reading.date,
    time: reading.time
  }));

  // Calculate averages
  const avgSystolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length) : 0;
  const avgDiastolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length) : 0;
  const latestReading = readings[readings.length - 1];

  const getBPCategory = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return { category: 'Normal', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 80) return { category: 'Elevated', color: 'text-yellow-600' };
    if (systolic < 140 || diastolic < 90) return { category: 'Stage 1 High', color: 'text-orange-600' };
    if (systolic < 180 || diastolic < 120) return { category: 'Stage 2 High', color: 'text-red-600' };
    return { category: 'Crisis', color: 'text-red-800' };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label} ${data.time ? `at ${data.time}` : ''}`}</p>
          <p className="text-red-500">{`Systolic: ${data.systolic} mmHg`}</p>
          <p className="text-blue-500">{`Diastolic: ${data.diastolic} mmHg`}</p>
          {data.pulse && <p className="text-purple-500">{`Pulse: ${data.pulse} bpm`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">Blood Pressure Monitor</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Average BP</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">{avgSystolic}/{avgDiastolic}</p>
            <p className="text-sm text-blue-700">mmHg</p>
          </div>
          
          {latestReading && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Latest Reading</h3>
              </div>
              <p className="text-2xl font-bold text-green-900">{latestReading.systolic}/{latestReading.diastolic}</p>
              <p className="text-sm text-green-700">{new Date(latestReading.date).toLocaleDateString()}</p>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Total Readings</h3>
            </div>
            <p className="text-2xl font-bold text-purple-900">{readings.length}</p>
            <p className="text-sm text-purple-700">recorded</p>
          </div>
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
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic *</label>
                <input
                  type="number"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleInputChange}
                  placeholder="120"
                  required
                  min="70"
                  max="250"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic *</label>
                <input
                  type="number"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                  placeholder="80"
                  required
                  min="40"
                  max="150"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (BPM)</label>
                <input
                  type="number"
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleInputChange}
                  placeholder="72"
                  min="40"
                  max="200"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g., after workout, before medication"
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

        {/* Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Blood Pressure Trends</h2>
          <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    name="Systolic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Diastolic"
                  />
                  {chartData.some(d => d.pulse) && (
                    <Line 
                      type="monotone" 
                      dataKey="pulse" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                      name="Pulse"
                    />
                  )}
                </LineChart>
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

        {/* Readings Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Readings</h2>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP Reading</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pulse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.slice().reverse().map((reading) => {
                  const category = getBPCategory(reading.systolic, reading.diastolic);
                  return (
                    <tr key={reading.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reading.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.time || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {reading.systolic}/{reading.diastolic}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${category.color}`}>
                        {category.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.pulse ? `${reading.pulse} bpm` : '-'}
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

export default BloodPressureMonitor;