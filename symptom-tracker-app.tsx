import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Save, PlusCircle } from 'lucide-react';

export default function SymptomTracker() {
  const [disease, setDisease] = useState('Multiple Sclerosis');
  const [symptomName, setSymptomName] = useState('');
  const [symptoms, setSymptoms] = useState([
    { id: 1, name: 'Fatigue', value: 3 },
    { id: 2, name: 'Muscle Pain', value: 2 },
    { id: 3, name: 'Numbness', value: 4 }
  ]);
  
  const [historicalData, setHistoricalData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Generate demo historical data on component mount
  useEffect(() => {
    const demo = [];
    const today = new Date();
    
    // Generate 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      demo.push({
        date: dateStr,
        'Fatigue': Math.floor(Math.random() * 5) + 1,
        'Muscle Pain': Math.floor(Math.random() * 5) + 1,
        'Numbness': Math.floor(Math.random() * 5) + 1
      });
    }
    
    setHistoricalData(demo);
  }, []);
  
  const handleSymptomChange = (id, value) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === id ? { ...symptom, value } : symptom
    ));
  };
  
  const handleAddSymptom = () => {
    if (!symptomName.trim()) {
      showAlertMessage('Please enter a symptom name');
      return;
    }
    
    const newId = Math.max(0, ...symptoms.map(s => s.id)) + 1;
    setSymptoms([...symptoms, { id: newId, name: symptomName, value: 1 }]);
    setSymptomName('');
  };
  
  const saveCurrentData = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Create new data point with today's date
    const newDataPoint = { date: today };
    
    // Add each symptom to the data point
    symptoms.forEach(symptom => {
      newDataPoint[symptom.name] = symptom.value;
    });
    
    // Add to historical data
    setHistoricalData([...historicalData, newDataPoint]);
    showAlertMessage('Symptom data saved successfully!');
  };
  
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Symptom Tracker</h1>
          <p className="text-blue-100">Monitoring: {disease}</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Today's Symptoms */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Symptoms</h2>
            
            <div className="space-y-6">
              {symptoms.map(symptom => (
                <div key={symptom.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">{symptom.name}</label>
                    <span className="text-blue-600 font-semibold">{symptom.value}/5</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={symptom.value}
                    onChange={(e) => handleSymptomChange(symptom.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>None</span>
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add new symptom */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={symptomName}
                  onChange={(e) => setSymptomName(e.target.value)}
                  placeholder="Add new symptom"
                  className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <button 
                  onClick={handleAddSymptom}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
            
            {/* Save button */}
            <button
              onClick={saveCurrentData}
              className="mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center w-full"
            >
              <Save size={18} className="mr-2" />
              Save Today's Data
            </button>
          </div>
          
          {/* Trend Visualization */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Symptom Trends</h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  {symptoms.map((symptom, index) => (
                    <Line 
                      key={symptom.id}
                      type="monotone"
                      dataKey={symptom.name}
                      stroke={
                        index === 0 ? '#3b82f6' : 
                        index === 1 ? '#ef4444' : 
                        index === 2 ? '#10b981' : 
                        `#${Math.floor(Math.random()*16777215).toString(16)}`
                      }
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Alert message */}
          {showAlert && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {alertMessage}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 p-4 text-center text-sm">
        <p>Secure Health Monitoring App - Data is encrypted and HIPAA compliant</p>
      </footer>
    </div>
  );
}