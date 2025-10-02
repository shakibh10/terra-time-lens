import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MapPin, Globe, Award, Eye, Gamepad2, Headphones, Camera, ArrowRight, CheckCircle, XCircle, RotateCcw, Zap, Thermometer, TreePine, Building, Users, Target, Star, Satellite, RefreshCw, AlertCircle, TrendingUp, Droplets, Wind, Cloud, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { BANGLADESH_LOCATIONS, fetchAllTerraData } from '@/lib/nasaApi';
import { useToast } from '@/hooks/use-toast';

const TerraInteractiveSystem = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState('intro');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('dhaka');
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [vrYear, setVrYear] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [terraData, setTerraData] = useState<any>(null);

  // Bangladesh location details
  const locations: Record<string, any> = {
    dhaka: {
      name: 'Dhaka, Bangladesh',
      coordinates: '23.8103°N, 90.4125°E',
      population2000: '10.2 million',
      population2025: '22.5 million',
      tempIncrease: 1.8,
      keyChanges: [
        'Population more than doubled since 2000',
        'Urban area expanded by 240%',
        'Lost 58% of natural vegetation and water bodies',
        'Air quality deteriorated 320%',
        'Heat-related health issues increased 180%'
      ],
      climateImpacts: 'Dhaka now experiences 85+ days above 35°C annually, with dangerous heat index values',
      solutions: 'Green roofs, urban forestry, air quality monitoring, sustainable transport',
      terraData: 'MODIS shows rapid urban sprawl, ASTER reveals 2-4°C temperature difference from rural areas'
    },
    chittagong: {
      name: 'Chittagong, Bangladesh',
      coordinates: '22.3569°N, 91.7832°E',
      population2000: '2.5 million',
      population2025: '5.2 million',
      tempIncrease: 1.5,
      keyChanges: [
        'Major port expansion and industrial growth',
        'Coastal erosion affecting 15% of shoreline',
        'Shipping emissions increased 280%',
        'Mangrove forests reduced by 25%',
        'Cyclone vulnerability increased'
      ],
      climateImpacts: 'Rising sea levels combined with land subsidence threaten coastal communities',
      solutions: 'Mangrove restoration, green port infrastructure, emission controls',
      terraData: 'MISR aerosol data shows shipping pollution, MODIS tracks coastal changes'
    },
    sylhet: {
      name: 'Sylhet, Bangladesh',
      coordinates: '24.8949°N, 91.8687°E',
      population2000: '0.5 million',
      population2025: '0.8 million',
      tempIncrease: 1.2,
      keyChanges: [
        'Tea plantation area increased 45%',
        'Wetland habitats reduced by 30%',
        'Flash flood frequency up 150%',
        'Tourism development expanded 200%',
        'Deforestation in surrounding hills'
      ],
      climateImpacts: 'Changing rainfall patterns affect tea production and increase flood risk',
      solutions: 'Sustainable agriculture, wetland conservation, early warning systems',
      terraData: 'MODIS NDVI monitors vegetation health, shows seasonal flooding patterns'
    },
    khulna: {
      name: 'Khulna, Bangladesh',
      coordinates: '22.8456°N, 89.5403°E',
      population2000: '1.0 million',
      population2025: '1.8 million',
      tempIncrease: 1.4,
      keyChanges: [
        'Gateway to Sundarbans mangrove forest',
        'Shrimp farming expanded 180%',
        'Salinity intrusion increased 65%',
        'Cyclone Sidr (2007) caused major devastation',
        'Climate migration to urban areas'
      ],
      climateImpacts: 'Sea level rise and saltwater intrusion threaten agriculture and freshwater',
      solutions: 'Mangrove expansion, saline-resistant crops, climate-resilient infrastructure',
      terraData: 'MODIS tracks Sundarbans health, ASTER measures land elevation changes'
    }
  };

  // All quiz questions - randomly selected
  const allQuizQuestions = [
    {
      question: "Which Terra instrument is primarily used for measuring land surface temperatures?",
      options: ["MODIS", "ASTER", "MISR", "CERES"],
      correct: 1,
      explanation: "ASTER (Advanced Spaceborne Thermal Emission and Reflection Radiometer) specializes in thermal imaging and land surface temperature measurements."
    },
    {
      question: "What is Bangladesh's capital city monitored by Terra for urban heat islands?",
      options: ["Chittagong", "Dhaka", "Sylhet", "Khulna"],
      correct: 1,
      explanation: "Dhaka, the capital of Bangladesh, has grown from 10.2 to 22.5 million people, creating significant urban heat island effects."
    },
    {
      question: "Which Terra instrument detects active fires and thermal anomalies?",
      options: ["ASTER", "MODIS", "MOPITT", "CERES"],
      correct: 1,
      explanation: "MODIS (Moderate Resolution Imaging Spectroradiometer) provides near real-time fire detection data through NASA's FIRMS system."
    },
    {
      question: "What is the primary environmental concern for Khulna?",
      options: ["Air pollution", "Deforestation", "Salinity intrusion", "Urban sprawl"],
      correct: 2,
      explanation: "Khulna, near the Sundarbans, faces salinity intrusion which has increased 65% due to sea level rise and affects agriculture."
    },
    {
      question: "Which instrument measures carbon monoxide pollution?",
      options: ["MODIS", "ASTER", "MOPITT", "CERES"],
      correct: 2,
      explanation: "MOPITT (Measurements of Pollution in the Troposphere) specifically monitors carbon monoxide levels in the atmosphere."
    },
    {
      question: "How many viewing angles does MISR use for 3D Earth observation?",
      options: ["3 angles", "5 angles", "9 angles", "12 angles"],
      correct: 2,
      explanation: "MISR (Multi-angle Imaging SpectroRadiometer) captures images from 9 different angles to create 3D perspectives."
    },
    {
      question: "What has been Dhaka's temperature increase since 2000?",
      options: ["0.8°C", "1.2°C", "1.8°C", "2.5°C"],
      correct: 2,
      explanation: "Dhaka has experienced a 1.8°C temperature increase, making it significantly hotter than surrounding rural areas."
    },
    {
      question: "Which city is the gateway to the Sundarbans mangrove forest?",
      options: ["Dhaka", "Chittagong", "Sylhet", "Khulna"],
      correct: 3,
      explanation: "Khulna is located near the Sundarbans, the world's largest mangrove forest, which Terra monitors for health and changes."
    },
    {
      question: "What does CERES measure on Terra?",
      options: ["Fire detection", "Vegetation health", "Earth's energy balance", "Air pollution"],
      correct: 2,
      explanation: "CERES (Clouds and Earth's Radiant Energy System) measures incoming solar radiation and outgoing heat to study Earth's energy balance."
    },
    {
      question: "Which Bangladeshi city is known for tea plantations monitored by Terra?",
      options: ["Dhaka", "Chittagong", "Sylhet", "Khulna"],
      correct: 2,
      explanation: "Sylhet's tea region is monitored using MODIS NDVI data to track vegetation health and productivity."
    },
    {
      question: "When was NASA's Terra satellite launched?",
      options: ["1995", "1999", "2000", "2005"],
      correct: 1,
      explanation: "Terra was launched in December 1999 and has been continuously observing Earth for over 25 years."
    },
    {
      question: "What percentage has Chittagong's shipping emissions increased?",
      options: ["150%", "200%", "280%", "350%"],
      correct: 2,
      explanation: "As a major port city, Chittagong's shipping emissions have increased 280%, detectable by Terra's MISR instrument."
    }
  ];

  // Get random quiz questions
  const getRandomQuestions = () => {
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  const [quizQuestions, setQuizQuestions] = useState(getRandomQuestions());

  // Story scripts
  const storyScripts: Record<string, string> = {
    intro: "Welcome to our journey through 25 years of Earth observation with NASA's Terra satellite. Since 2000, Terra's five instruments have watched Bangladesh change in ways we never expected.",
    dhaka: "Dhaka, Bangladesh - a megacity transformed. Terra's ASTER instrument revealed how explosive urban growth turned this city into one of South Asia's most intense urban heat islands, with temperatures rising 1.8°C and population doubling to 22.5 million people.",
    chittagong: "Chittagong - the port city under pressure. MODIS and MISR data show how massive shipping expansion and industrial development created pollution hotspots, while coastal erosion threatens 15% of the shoreline.",
    sylhet: "Sylhet - the green tea heartland. MODIS NDVI data monitors the health of vast tea plantations, revealing how changing rainfall patterns affect productivity and how flash floods have increased by 150%.",
    khulna: "Khulna - guardian of the Sundarbans. Terra's instruments track the world's largest mangrove forest, showing how salinity intrusion increased 65% due to sea level rise.",
    solutions: "These four cities represent Bangladesh's climate crisis. But Terra's data also points toward solutions - proven strategies for coastal protection and sustainable urbanization.",
    conclusion: "Terra's 25 years of data give us the roadmap. The question is whether we'll act fast enough."
  };

  // Fetch live data
  useEffect(() => {
    fetchLiveData();
  }, [selectedLocation]);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTerraData(selectedLocation, new Date().toISOString().split('T')[0]);
      setTerraData(data);
      toast({
        title: "✅ Data Loaded",
        description: `Live Terra data for ${data.location} retrieved successfully`,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "⚠️ Data Error",
        description: "Using cached data. Some information may be limited.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // VR Experience Component
  const VRExperience = ({ location, year }: { location: string; year: number }) => {
    const locationData = locations[location];
    const progress = (year - 2000) / 25;
    const tempChange = progress * locationData.tempIncrease;
    const urbanGrowth = progress * 100;
    
    return (
      <Card className="relative overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <div className="relative w-full h-96 bg-gradient-to-b from-green-400 via-blue-500 to-indigo-900 overflow-hidden">
            <div 
              className="absolute top-0 w-full h-1/3 transition-all duration-1000"
              style={{
                background: `linear-gradient(to bottom, rgba(100, ${Math.max(150, 255 - tempChange * 30)}, 100, 0.8), rgba(50, ${Math.max(100, 200 - tempChange * 40)}, 150, 0.6))`
              }}
            />
            
            <div className="absolute bottom-0 w-full h-2/3 flex items-end justify-center px-4">
              {Array.from({ length: Math.floor(8 + urbanGrowth / 8) }).map((_, i) => (
                <div
                  key={i}
                  className="mx-0.5 transition-all duration-1000 opacity-90"
                  style={{
                    width: `${8 + Math.random() * 12}px`,
                    height: `${20 + progress * 80 + Math.random() * 40}px`,
                    backgroundColor: `rgb(${Math.min(200, 60 + tempChange * 25)}, ${Math.max(40, 100 - tempChange * 15)}, 70)`,
                    transform: `scaleY(${0.3 + progress * 0.7})`
                  }}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <Satellite className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Terra Monitoring</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="bg-black/70 backdrop-blur-sm border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-primary">{year}</div>
                  <div className="text-xl mb-3 text-white">{locationData.name}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-warning">+{tempChange.toFixed(1)}°C</div>
                      <div className="text-muted-foreground">Temperature Rise</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-destructive">{urbanGrowth.toFixed(0)}%</div>
                      <div className="text-muted-foreground">Urban Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 text-white text-xs">
                  <span>2000</span>
                  <span className="text-primary font-bold">{year}</span>
                  <span>2025</span>
                </div>
                <Slider
                  value={[year]}
                  onValueChange={(value) => setVrYear(value[0])}
                  min={2000}
                  max={2025}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Quiz Component
  const QuizGame = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleAnswer = (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
      setShowExplanation(true);
      
      if (answerIndex === quizQuestions[currentQuestion].correct) {
        setGameScore(prev => prev + 20);
      }
      
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setShowExplanation(false);
        } else {
          setGameCompleted(true);
        }
      }, 3000);
    };

    if (gameCompleted) {
      const percentage = (gameScore / (quizQuestions.length * 20)) * 100;
      return (
        <div className="text-center space-y-6">
          <Star className="w-16 h-16 text-yellow-400 mx-auto" />
          <h3 className="text-3xl font-bold">Quiz Complete!</h3>
          <div className="text-6xl font-bold text-primary">{gameScore}</div>
          <Badge variant={percentage >= 80 ? "default" : "secondary"}>
            {percentage.toFixed(0)}% Score
          </Badge>
          <Button
            onClick={() => {
              setGameCompleted(false);
              setCurrentQuestion(0);
              setGameScore(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setQuizQuestions(getRandomQuestions());
            }}
          >
            Play Again
          </Button>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-4">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="font-bold">Score: {gameScore}</span>
          </div>
          <h3 className="text-xl font-bold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                variant={showExplanation ? (index === question.correct ? "default" : selectedAnswer === index ? "destructive" : "outline") : "outline"}
                className="w-full justify-start"
              >
                {showExplanation && index === question.correct && <CheckCircle className="w-5 h-5 mr-2" />}
                {showExplanation && selectedAnswer === index && index !== question.correct && <XCircle className="w-5 h-5 mr-2" />}
                {option}
              </Button>
            ))}
          </div>
        </div>
        {showExplanation && (
          <Card className="bg-blue-900/30">
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">Explanation:</h4>
              <p>{question.explanation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Live Data Panel
  const LiveDataPanel = () => {
    if (!terraData || loading) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
            <p>Loading live Terra satellite data...</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* MODIS Fire Data */}
        <Card className="border-red-500/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-red-400" />
              MODIS - Fire & Thermal Detection
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-400">{terraData.modis.total}</div>
                <div className="text-sm text-muted-foreground">Active Fires (7 days)</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-400">{terraData.modis.highConfidence}</div>
                <div className="text-sm text-muted-foreground">High Confidence</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-400">
                  {terraData.modis.avgBrightness > 0 ? terraData.modis.avgBrightness.toFixed(1) : '0'}K
                </div>
                <div className="text-sm text-muted-foreground">Avg Brightness</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-300">
                  {terraData.modis.avgFRP > 0 ? terraData.modis.avgFRP.toFixed(1) : '0'} MW
                </div>
                <div className="text-sm text-muted-foreground">Fire Power</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CERES Climate Data */}
        {terraData.ceres && (
          <Card className="border-blue-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Sun className="w-6 h-6 mr-2 text-yellow-400" />
                CERES - Energy Balance & Weather
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <Thermometer className="w-6 h-6 mb-2 text-red-400" />
                  <div className="text-2xl font-bold">{terraData.ceres.temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <Sun className="w-6 h-6 mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold">{terraData.ceres.solarRadiation.toFixed(0)} W/m²</div>
                  <div className="text-sm text-muted-foreground">Solar Radiation</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <Cloud className="w-6 h-6 mb-2 text-gray-400" />
                  <div className="text-2xl font-bold">{terraData.ceres.cloudCover.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Cloud Cover</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <Droplets className="w-6 h-6 mb-2 text-blue-400" />
                  <div className="text-2xl font-bold">{terraData.ceres.humidity.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Location Details
  const LocationDetails = ({ locationKey }: { locationKey: string }) => {
    const location = locations[locationKey];
    
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{location.name}</h2>
            <p className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {location.coordinates}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-bold">Population Growth</h3>
              </div>
              <div className="text-sm">
                <p>2000: {location.population2000}</p>
                <p>2025: {location.population2025}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Thermometer className="w-5 h-5 text-red-400 mr-2" />
                <h3 className="text-lg font-bold">Temperature Rise</h3>
              </div>
              <div className="text-2xl font-bold text-red-400">+{location.tempIncrease}°C</div>
              <div className="text-sm text-muted-foreground">Over 25 years</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Building className="w-5 h-5 text-orange-400 mr-2" />
              <h3 className="text-lg font-bold">Key Changes (2000-2025)</h3>
            </div>
            <ul className="space-y-2">
              {location.keyChanges.map((change: string, index: number) => (
                <li key={index} className="flex items-start text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                  {change}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <h3 className="text-lg font-bold">Climate Impacts</h3>
            </div>
            <p className="text-sm">{location.climateImpacts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <TreePine className="w-5 h-5 text-green-400 mr-2" />
              <h3 className="text-lg font-bold">Solutions & Adaptations</h3>
            </div>
            <p className="text-sm">{location.solutions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Globe className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-bold">Terra Data Insights</h3>
            </div>
            <p className="text-sm">{location.terraData}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Terra Bangladesh Monitor</h1>
              <p className="text-sm text-blue-300">Live Satellite Data • 5 Instruments • 4 Cities</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={fetchLiveData}
                disabled={loading}
                variant="default"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button
                onClick={() => setAudioMuted(!audioMuted)}
                variant="outline"
                size="sm"
              >
                {audioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {[
              { key: 'intro', label: 'Mission Overview', icon: Globe },
              { key: 'story', label: 'City Stories', icon: Camera },
              { key: 'analysis', label: 'Live Data', icon: TrendingUp },
              { key: 'locations', label: 'City Details', icon: MapPin },
              { key: 'quiz', label: 'Terra Quiz', icon: Gamepad2 },
              { key: 'vr', label: 'Time Machine', icon: Eye },
              { key: 'solutions', label: 'Solutions', icon: Award }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setCurrentSection(key)}
                variant={currentSection === key ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction Section */}
        {currentSection === 'intro' && (
          <div className="text-center space-y-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                NASA Terra: 25 Years Monitoring Bangladesh
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Experience how Terra's five instruments have tracked Bangladesh's environmental transformation from 2000 to 2025
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BANGLADESH_LOCATIONS.map((location) => (
                <Card key={location.id} className="hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                    <div className="text-lg font-bold mb-2">{location.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{location.description}</div>
                    <div className="text-xs text-blue-300">{location.focus}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">🛰️ Terra's Five Instruments</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['MODIS', 'ASTER', 'MOPITT', 'MISR', 'CERES'].map(inst => (
                    <div key={inst} className="text-center">
                      <Badge variant="outline" className="text-lg mb-2">{inst}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {inst === 'MODIS' && 'Fire & Vegetation'}
                        {inst === 'ASTER' && 'Temperature'}
                        {inst === 'MOPITT' && 'Air Pollution'}
                        {inst === 'MISR' && 'Multi-angle'}
                        {inst === 'CERES' && 'Energy Balance'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* City Stories Section */}
        {currentSection === 'story' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Bangladesh City Stories</h2>
              <p className="text-xl text-muted-foreground">Click on a city to watch its 25-year transformation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {BANGLADESH_LOCATIONS.map((location) => (
                <Button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  variant={selectedLocation === location.id ? "default" : "outline"}
                  className="h-auto p-6 flex flex-col items-center"
                >
                  <MapPin className="w-6 h-6 mb-2" />
                  <div className="font-bold text-lg">{location.name}</div>
                  <div className="text-sm opacity-75">{location.description}</div>
                </Button>
              ))}
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Camera className="w-20 h-20 text-white mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {locations[selectedLocation].name} - 25 Years of Change
                    </h3>
                    <p className="text-blue-200 mb-6">
                      Animation showing transformation from 2000 to 2025 would play here
                    </p>
                    <Button onClick={() => setVideoPlaying(!videoPlaying)}>
                      {videoPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {videoPlaying ? 'Pause' : 'Play'} Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Headphones className="w-6 h-6 text-purple-400 mr-3" />
                    <h3 className="text-xl font-bold">Story Narration</h3>
                  </div>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play Narration
                  </Button>
                </div>
                <p className="text-lg leading-relaxed">{storyScripts[selectedLocation]}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Data Analysis */}
        {currentSection === 'analysis' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live Terra Data Analysis</h2>
              <p className="text-xl text-muted-foreground">Real-time satellite data from all 5 Terra instruments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {BANGLADESH_LOCATIONS.map((location) => (
                <Button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  variant={selectedLocation === location.id ? "default" : "outline"}
                  className="h-auto p-4"
                >
                  <div>
                    <div className="font-bold">{location.name}</div>
                    <div className="text-sm opacity-75">{location.focus}</div>
                  </div>
                </Button>
              ))}
            </div>

            <LiveDataPanel />
          </div>
        )}

        {/* City Details */}
        {currentSection === 'locations' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">City Transformations</h2>
              <p className="text-xl text-muted-foreground">Detailed analysis of 25 years of change</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {BANGLADESH_LOCATIONS.map((location) => (
                <Button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  variant={selectedLocation === location.id ? "default" : "outline"}
                  className="h-auto p-4"
                >
                  <div>
                    <div className="font-bold">{location.name}</div>
                    <div className="text-sm">+{locations[location.id].tempIncrease}°C</div>
                  </div>
                </Button>
              ))}
            </div>

            <LocationDetails locationKey={selectedLocation} />
          </div>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Terra Bangladesh Quiz</h2>
              <p className="text-xl text-muted-foreground mb-4">Test your knowledge!</p>
              <p className="text-sm text-blue-300">💡 Each time you play, you'll get different questions</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <QuizGame />
              </CardContent>
            </Card>
          </div>
        )}

        {/* VR Time Machine */}
        {currentSection === 'vr' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Virtual Reality Time Travel</h2>
              <p className="text-xl text-muted-foreground">Experience how cities transformed over 25 years</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {BANGLADESH_LOCATIONS.map((location) => (
                <Button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  variant={selectedLocation === location.id ? "default" : "outline"}
                  className="h-auto p-4"
                >
                  <div>
                    <div className="font-bold">{location.name}</div>
                    <div className="text-sm">+{locations[location.id].tempIncrease}°C</div>
                  </div>
                </Button>
              ))}
            </div>

            <VRExperience location={selectedLocation} year={vrYear} />
          </div>
        )}

        {/* Solutions Section */}
        {currentSection === 'solutions' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Climate Solutions for Bangladesh</h2>
              <p className="text-xl text-muted-foreground">Terra's data reveals pathways to resilience</p>
            </div>

            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20">
              <CardContent className="p-8 text-center">
                <Award className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">Comprehensive Climate Strategy</h3>
                <p className="text-xl mb-6 max-w-4xl mx-auto">
                  Based on 25 years of Terra satellite data, proven strategies can build resilience for Bangladesh's 170 million people
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <TreePine className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="text-xl font-bold mb-3">Green Infrastructure</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400" />
                      Urban forests and green roofs
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400" />
                      Mangrove restoration projects
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400" />
                      Wetland conservation programs
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Building className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="text-xl font-bold mb-3">Smart Urban Planning</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                      Climate-resilient infrastructure
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                      Sustainable transport systems
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                      Flood management strategies
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="text-xl font-bold mb-3">Technology Solutions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400" />
                      Early warning systems
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400" />
                      Air quality monitoring
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400" />
                      Renewable energy adoption
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerraInteractiveSystem;
