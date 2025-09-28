import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MapPin, Globe, Award, Book, Eye, Gamepad2, Headphones, Camera, ArrowRight, CheckCircle, XCircle, RotateCcw, Zap, Thermometer, TreePine, Building, Users, Calendar, Target, Star, Satellite, Activity, TrendingUp, Shield, Lightbulb, Wind, Droplets, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import terraHero from '@/assets/terra-hero.jpg';
import phoenixHeat from '@/assets/phoenix-heat.jpg';
import coolCity from '@/assets/cool-city.jpg';

const TerraInteractiveSystem = () => {
  const [currentSection, setCurrentSection] = useState('intro');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('phoenix');
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [vrYear, setVrYear] = useState(2000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioNarrating, setAudioNarrating] = useState(false);

  // Comprehensive location data with Terra satellite insights
  const locations = {
    phoenix: {
      name: 'Phoenix, Arizona, USA',
      coordinates: '33.4484°N, 112.0740°W',
      population2000: '1.32 million',
      population2025: '1.8 million',
      tempIncrease: 4.2,
      keyChanges: [
        'Urban sprawl expanded by 340% since 2000',
        'Lost 45% of natural desert vegetation',
        'Heat-related deaths increased 300%',
        'Energy consumption up 180% in summer',
        'Water demand increased by 65%'
      ],
      climateImpacts: 'Phoenix now experiences 145+ days above 100°F annually, compared to 110 days in 2000',
      solutions: 'Cool pavement programs, urban tree planting, reflective building materials',
      terraData: 'ASTER thermal data shows downtown temperatures 8-12°F higher than surrounding desert',
      instruments: ['ASTER', 'MODIS'],
      color: 'terra-red'
    },
    austin: {
      name: 'Austin, Texas, USA',
      coordinates: '30.2672°N, 97.7431°W',
      population2000: '656,000',
      population2025: '1.05 million',
      tempIncrease: 3.8,
      keyChanges: [
        'Tech boom drove 280% urban expansion',
        'Green spaces reduced by 35%',
        'Traffic congestion increased 400%',
        'New high-rise construction up 500%',
        'Impervious surface area doubled'
      ],
      climateImpacts: 'Summer heat index now regularly exceeds 110°F, 25% increase from 2000',
      solutions: 'Green building codes, urban canopy expansion, sustainable development zones',
      terraData: 'MODIS data reveals vegetation loss correlates directly with temperature increases',
      instruments: ['MODIS', 'MISR'],
      color: 'terra-orange'
    },
    jakarta: {
      name: 'Jakarta, Indonesia',
      coordinates: '6.2088°S, 106.8456°E',
      population2000: '8.3 million',
      population2025: '11.2 million',
      tempIncrease: 2.9,
      keyChanges: [
        'Massive coastal development projects',
        'Air pollution increased 180%',
        'Flooding frequency up 250%',
        'Green space per capita reduced 60%',
        'Informal settlements expanded 220%'
      ],
      climateImpacts: 'Combined heat and humidity create deadly heat index values above 130°F',
      solutions: 'Vertical gardens, flood management, public transport expansion, emission controls',
      terraData: 'MISR aerosol data shows pollution exacerbating urban heat island effect',
      instruments: ['MISR', 'MOPITT'],
      color: 'terra-purple'
    },
    delhi: {
      name: 'Delhi, India',
      coordinates: '28.7041°N, 77.1025°E',
      population2000: '12.8 million',
      population2025: '18.6 million',
      tempIncrease: 3.5,
      keyChanges: [
        'Construction boom created concrete jungle',
        'Air quality deteriorated 300%',
        'Groundwater levels dropped 40%',
        'Vehicle emissions increased 450%',
        'Industrial expansion in periphery'
      ],
      climateImpacts: 'Peak summer temperatures now exceed 118°F, with heat waves lasting longer',
      solutions: 'Metro expansion, renewable energy adoption, green corridor development',
      terraData: 'MOPITT carbon monoxide data correlates with temperature spikes and health impacts',
      instruments: ['MOPITT', 'CERES'],
      color: 'terra-green'
    }
  };

  // Terra instruments data
  const terraInstruments = {
    ASTER: {
      name: 'Advanced Spaceborne Thermal Emission and Reflection Radiometer',
      specialty: 'Land surface temperature measurement',
      description: 'High-resolution thermal imaging for detailed heat island mapping',
      color: 'terra-red'
    },
    MODIS: {
      name: 'Moderate Resolution Imaging Spectroradiometer',
      specialty: 'Large-scale environmental monitoring',
      description: 'Vegetation tracking and land use change detection',
      color: 'terra-green'
    },
    MISR: {
      name: 'Multi-angle Imaging SpectroRadiometer',
      specialty: '3D atmospheric analysis',
      description: 'Multi-angle views for pollution and aerosol tracking',
      color: 'terra-purple'
    },
    MOPITT: {
      name: 'Measurements of Pollution in the Troposphere',
      specialty: 'Air quality monitoring',
      description: 'Carbon monoxide and pollution measurement',
      color: 'terra-orange'
    },
    CERES: {
      name: 'Clouds and the Earth\'s Radiant Energy System',
      specialty: 'Energy balance monitoring',
      description: 'Earth\'s energy budget and radiation balance',
      color: 'terra-blue'
    }
  };

  // Enhanced quiz questions
  const quizQuestions = [
    {
      question: "Which Terra instrument is primarily used for measuring land surface temperatures?",
      options: ["MODIS", "ASTER", "MISR", "CERES"],
      correct: 1,
      explanation: "ASTER (Advanced Spaceborne Thermal Emission and Reflection Radiometer) specializes in thermal imaging and land surface temperature measurements with high spatial resolution."
    },
    {
      question: "How much has Phoenix's temperature increased over Terra's 25-year mission?",
      options: ["2.1°C", "3.8°C", "4.2°C", "5.5°C"],
      correct: 2,
      explanation: "Phoenix has experienced a 4.2°C (7.6°F) increase in average temperatures, making it one of the most affected cities by urban heat islands globally."
    },
    {
      question: "What is the primary cause of urban heat islands observed by Terra?",
      options: ["Global warming", "Population growth", "Concrete and asphalt absorption", "Industrial emissions"],
      correct: 2,
      explanation: "Concrete and asphalt surfaces absorb and retain heat during the day and release it slowly at night, creating temperatures significantly higher than surrounding natural areas."
    },
    {
      question: "Which Terra instrument provides multi-angle views for 3D atmospheric analysis?",
      options: ["MODIS", "ASTER", "MISR", "MOPITT"],
      correct: 2,
      explanation: "MISR (Multi-angle Imaging SpectroRadiometer) captures images from nine different angles to create 3D perspectives and track atmospheric particles and pollution."
    },
    {
      question: "What percentage of natural desert vegetation has Phoenix lost since 2000 according to Terra data?",
      options: ["25%", "35%", "45%", "60%"],
      correct: 2,
      explanation: "Phoenix has lost 45% of its natural desert vegetation due to urban expansion, contributing significantly to the heat island effect and reduced natural cooling."
    }
  ];

  // Story scripts for enhanced narration
  const storyScripts = {
    intro: "Welcome to our journey through 25 years of Earth observation with NASA's Terra satellite. Since 2000, Terra's five instruments have watched our planet change in ways we never expected, revealing a hidden crisis in our cities.",
    phoenix: "Phoenix, Arizona - a desert city that became a furnace. Terra's ASTER instrument revealed how urban sprawl turned this desert into one of America's hottest urban heat islands, with temperatures rising 4.2°C above natural levels.",
    austin: "Austin, Texas - the tech boom city. MODIS data shows how rapid development and population growth created dangerous temperature spikes across the growing metropolitan area, with heat index values regularly exceeding safe limits.",
    jakarta: "Jakarta, Indonesia - a megacity under pressure. MISR's multi-angle views captured how massive coastal development and pollution created a perfect storm of heat and humidity that threatens millions of lives.",
    delhi: "Delhi, India - ancient city, modern crisis. MOPITT's pollution measurements revealed how industrial growth and vehicle emissions amplified the urban heat effect, creating deadly combinations of heat and air pollution.",
    solutions: "These four cities represent a global crisis affecting 3.8 billion people. But Terra's data also points toward solutions - proven strategies that can reduce urban temperatures by 3-7°C and save lives.",
    conclusion: "The future of our cities hangs in the balance. Terra's 25 years of data give us the roadmap. The question isn't whether we can cool our cities - it's whether we'll act fast enough."
  };

  // VR Experience Component with enhanced realism
  const VRExperience = ({ location, year }: { location: string; year: number }) => {
    const locationData = locations[location as keyof typeof locations];
    const progress = (year - 2000) / 25;
    const tempChange = progress * locationData.tempIncrease;
    const urbanGrowth = progress * 100;
    const heatIntensity = Math.min(1, tempChange / 5);
    
    return (
      <Card className="relative overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <div className="relative w-full h-96 bg-gradient-to-b from-orange-400 via-red-500 to-purple-900 overflow-hidden">
            {/* Dynamic sky with heat distortion */}
            <div 
              className="absolute top-0 w-full h-1/3 transition-all duration-1000"
              style={{
                background: `linear-gradient(to bottom, 
                  rgba(255, ${Math.max(100, 255 - tempChange * 30)}, 0, ${0.7 + heatIntensity * 0.3}),
                  rgba(255, ${Math.max(50, 255 - tempChange * 40)}, 0, ${0.5 + heatIntensity * 0.3}))`
              }}
            />
            
            {/* Urban landscape growing over time */}
            <div className="absolute bottom-0 w-full h-2/3 flex items-end justify-center px-4">
              {Array.from({ length: Math.floor(8 + urbanGrowth / 8) }).map((_, i) => (
                <div
                  key={i}
                  className="mx-0.5 transition-all duration-1000 opacity-90"
                  style={{
                    width: `${8 + Math.random() * 12}px`,
                    height: `${20 + progress * 80 + Math.random() * 40}px`,
                    backgroundColor: `rgb(${Math.min(255, 80 + tempChange * 25)}, ${Math.max(40, 100 - tempChange * 20)}, 60)`,
                    transform: `scaleY(${0.3 + progress * 0.7})`,
                  }}
                />
              ))}
            </div>

            {/* Heat wave effects */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: Math.ceil(3 + heatIntensity * 5) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 heat-wave"
                  style={{
                    top: `${15 + i * 12}%`,
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.3 + heatIntensity * 0.5
                  }}
                />
              ))}
            </div>

            {/* Terra satellite indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <Satellite className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Terra Monitoring
              </span>
            </div>

            {/* VR Data Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="bg-black/70 backdrop-blur-sm border-primary/30">
                <CardContent className="p-6 text-center text-white">
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

            {/* Time controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64">
              <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3">
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

  // Enhanced Quiz Component
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
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-terra rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">Mission Complete!</h3>
            <div className="text-6xl font-bold text-primary space-glow">{gameScore}</div>
            <div className="text-xl text-muted-foreground">out of {quizQuestions.length * 20} points</div>
            <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
              {percentage.toFixed(0)}% Terra Expert Level
            </Badge>
          </div>
          
          <Card className={`border-2 ${percentage >= 80 ? 'border-success' : percentage >= 60 ? 'border-warning' : 'border-destructive'}`}>
            <CardContent className="p-6">
              {percentage >= 80 ? (
                <div className="text-success-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
                  <h4 className="text-xl font-bold mb-2">Terra Mission Specialist!</h4>
                  <p>Excellent! You're ready to lead the fight against urban heat islands with Terra's data.</p>
                </div>
              ) : percentage >= 60 ? (
                <div className="text-warning-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 text-warning" />
                  <h4 className="text-xl font-bold mb-2">Terra Data Analyst</h4>
                  <p>Good progress! Continue studying Terra's discoveries to master climate solutions.</p>
                </div>
              ) : (
                <div className="text-destructive-foreground">
                  <RotateCcw className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <h4 className="text-xl font-bold mb-2">Terra Trainee</h4>
                  <p>Keep exploring! Terra's 25-year story holds the keys to understanding our changing planet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={() => {
              setGameCompleted(false);
              setCurrentQuestion(0);
              setGameScore(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
            className="bg-gradient-terra hover:opacity-90 text-white px-8 py-3 text-lg space-glow"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restart Mission
          </Button>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="text-xl font-bold text-primary">{gameScore}</span>
            </div>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className="bg-gradient-terra h-3 rounded-full transition-all duration-500 space-glow"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-start space-x-3">
              <div className="bg-gradient-terra rounded-full p-2 mt-1">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1">{question.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                variant={
                  showExplanation
                    ? index === question.correct
                      ? "default"
                      : selectedAnswer === index
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className={`w-full text-left p-4 h-auto justify-start transition-all ${
                  showExplanation && index === question.correct
                    ? 'bg-success hover:bg-success border-success text-success-foreground'
                    : showExplanation && selectedAnswer === index && index !== question.correct
                    ? 'bg-destructive hover:bg-destructive border-destructive'
                    : !showExplanation
                    ? 'hover:bg-primary/10 hover:border-primary'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {showExplanation && index === question.correct && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                  {showExplanation && selectedAnswer === index && index !== question.correct && <XCircle className="w-5 h-5 flex-shrink-0" />}
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {showExplanation && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Lightbulb className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Terra Data Insight:</h4>
                  <p className="text-muted-foreground">{question.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Location Details Component
  const LocationDetails = ({ locationKey }: { locationKey: string }) => {
    const location = locations[locationKey as keyof typeof locations];
    
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 overflow-hidden">
          <div className={`bg-gradient-to-r from-${location.color} to-primary p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{location.name}</h2>
                <p className="text-white/90 flex items-center text-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  {location.coordinates}
                </p>
              </div>
              <div className="text-right text-white">
                <div className="text-4xl font-bold">+{location.tempIncrease}°C</div>
                <div className="text-white/80">Since 2000</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Users className="w-6 h-6 mr-2 text-primary" />
                Population Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">2000:</span>
                  <span className="font-bold text-foreground">{location.population2000}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">2025:</span>
                  <span className="font-bold text-foreground">{location.population2025}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-terra h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Thermometer className="w-6 h-6 mr-2 text-destructive" />
                Climate Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-destructive">+{location.tempIncrease}°C</div>
                <div className="text-sm text-muted-foreground">Temperature increase over 25 years</div>
                <Badge variant="destructive" className="mt-2">
                  Critical Heat Level
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <TrendingUp className="w-6 h-6 mr-2 text-warning" />
              Key Urban Transformations (2000-2025)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {location.keyChanges.map((change, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
                  <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{change}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Activity className="w-6 h-6 mr-2 text-destructive" />
                Climate Impacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{location.climateImpacts}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Shield className="w-6 h-6 mr-2 text-success" />
                Adaptation Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{location.solutions}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Satellite className="w-6 h-6 mr-2 text-primary" />
              Terra Satellite Data Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">{location.terraData}</p>
            <div className="flex flex-wrap gap-2">
              {location.instruments.map((instrument) => (
                <Badge key={instrument} variant="outline" className="border-primary/30">
                  {instrument}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Enhanced audio narration
  const playNarration = (section: string) => {
    setAudioNarrating(true);
    // Simulate audio playback
    setTimeout(() => setAudioNarrating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-space">
      
      {/* Enhanced Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-terra rounded-full flex items-center justify-center space-glow">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Terra: 25 Years of Earth Stories</h1>
                <p className="text-sm text-muted-foreground">NASA's Climate Monitoring Mission</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioMuted(!audioMuted)}
                className="border-primary/30 hover:bg-primary/10"
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              {audioNarrating && (
                <Badge variant="secondary" className="animate-pulse">
                  <Headphones className="w-3 h-3 mr-1" />
                  Narrating...
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'intro', label: 'Mission Overview', icon: Satellite },
              { key: 'story', label: 'Story & Video', icon: Camera },
              { key: 'locations', label: 'City Analysis', icon: MapPin },
              { key: 'quiz', label: 'Terra Quiz', icon: Gamepad2 },
              { key: 'vr', label: 'Time Machine', icon: Eye },
              { key: 'solutions', label: 'Global Solutions', icon: Award }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setCurrentSection(key)}
                variant={currentSection === key ? "default" : "outline"}
                size="sm"
                className={`flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentSection === key
                    ? 'bg-gradient-terra text-white space-glow'
                    : 'border-primary/30 hover:bg-primary/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Mission Overview Section */}
        {currentSection === 'intro' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${terraHero})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="relative p-12 text-center">
                <h2 className="text-5xl font-bold text-white mb-6 space-glow">
                  NASA Terra Satellite: 25 Years of Earth Observation
                </h2>
                <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                  Journey through a quarter-century of groundbreaking Earth science discoveries with 
                  interactive stories, immersive visualizations, and hands-on learning experiences 
                  that reveal the hidden crisis of urban heat islands.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => playNarration('intro')}
                    className="bg-gradient-terra hover:opacity-90 text-white px-6 py-3 space-glow"
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Play Introduction
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentSection('story')}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Begin Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Crisis Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(locations).map(([key, location]) => (
                <Card key={key} className="border-primary/20 hover:border-primary/40 transition-all cursor-pointer heat-glow hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-destructive mb-2">+{location.tempIncrease}°C</div>
                    <div className="text-lg font-medium text-foreground mb-2">{location.name.split(',')[0]}</div>
                    <div className="text-sm text-muted-foreground">Temperature increase since 2000</div>
                    <div className="mt-3 flex justify-center space-x-1">
                      {location.instruments.map((instrument) => (
                        <Badge key={instrument} variant="outline" className="text-xs border-primary/30">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Terra Instruments Showcase */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-3xl text-foreground flex items-center justify-center">
                  <Globe className="w-8 h-8 mr-3 text-primary" />
                  Terra's Five Eyes on Earth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(terraInstruments).map(([key, instrument]) => (
                    <Card key={key} className={`border-${instrument.color}/30 hover:border-${instrument.color} transition-all`}>
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <Badge variant="outline" className={`border-${instrument.color} text-${instrument.color} font-bold`}>
                            {key}
                          </Badge>
                          <h4 className="font-bold text-foreground text-sm">{instrument.specialty}</h4>
                          <p className="text-xs text-muted-foreground">{instrument.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Challenge Overview */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-foreground mb-4">The Urban Heat Crisis</h3>
                  <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                    Urban heat islands are creating dangerous living conditions for billions of people worldwide. 
                    Terra's five instruments have documented this crisis in unprecedented detail and pointed toward 
                    actionable solutions. Experience the data, learn the science, and explore the future of sustainable cities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-destructive">3.8 billion</div>
                      <div className="text-sm text-muted-foreground">People at risk from urban heat</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-warning">$2.4 trillion</div>
                      <div className="text-sm text-muted-foreground">Annual economic losses from heat</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">25 years</div>
                      <div className="text-sm text-muted-foreground">Of Terra satellite observations</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Story & Video Section */}
        {currentSection === 'story' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">The Terra Story: Cities Under Heat</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Watch how 25 years of satellite data revealed a hidden climate crisis in our cities
              </p>
            </div>

            {/* Enhanced Video Player */}
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${phoenixHeat})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-terra rounded-full flex items-center justify-center mx-auto space-glow">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Terra: 25 Years of Discovery</h3>
                      <p className="text-white/90 max-w-md">Experience the complete Terra animation showcasing urban heat island transformations</p>
                      <Button
                        onClick={() => setVideoPlaying(!videoPlaying)}
                        className="bg-gradient-terra hover:opacity-90 text-white px-8 py-3 space-glow"
                      >
                        {videoPlaying ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause Video
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Play Video
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Card className="bg-black/70 backdrop-blur-sm border-primary/30">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center space-x-3">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setVideoPlaying(!videoPlaying)}
                              className="text-white hover:bg-white/10"
                            >
                              {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <span className="text-sm">0:00 / 4:32</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4" />
                            <Slider value={[75]} max={100} step={1} className="w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Narration Scripts */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Headphones className="w-6 h-6 mr-3 text-primary" />
                  Interactive Narration Scripts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(storyScripts).map(([section, text]) => (
                  <Card key={section} className="border-secondary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-primary capitalize mb-2 flex items-center">
                            <div className="w-3 h-3 bg-gradient-terra rounded-full mr-2"></div>
                            {section} Narration
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">{text}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playNarration(section)}
                          className="ml-4 border-primary/30 hover:bg-primary/10"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* City Analysis Section */}
        {currentSection === 'locations' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">City Transformations: 25 Years of Change</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore detailed Terra satellite analysis of how these cities have transformed since 2000
              </p>
            </div>

            {/* Enhanced Location Selector */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(locations).map(([key, location]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  variant={selectedLocation === key ? "default" : "outline"}
                  className={`h-24 flex-col space-y-2 transition-all ${
                    selectedLocation === key
                      ? `bg-gradient-terra text-white space-glow`
                      : 'border-primary/30 hover:bg-primary/10'
                  }`}
                >
                  <div className="text-lg font-bold">{location.name.split(',')[0]}</div>
                  <div className="text-sm opacity-75">+{location.tempIncrease}°C warmer</div>
                  <div className="flex space-x-1">
                    {location.instruments.map((instrument) => (
                      <Badge key={instrument} variant="outline" className="text-xs">
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </Button>
              ))}
            </div>

            {/* Selected Location Analysis */}
            <LocationDetails locationKey={selectedLocation} />
          </div>
        )}

        {/* Terra Quiz Section */}
        {currentSection === 'quiz' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Terra Knowledge Challenge</h2>
              <p className="text-xl text-muted-foreground">
                Test your understanding of Terra's 25-year climate monitoring mission
              </p>
            </div>

            <Card className="border-primary/20">
              <CardContent className="p-8">
                <QuizGame />
              </CardContent>
            </Card>
          </div>
        )}

        {/* VR Time Machine Section */}
        {currentSection === 'vr' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Terra Time Machine</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience how cities transformed over Terra's 25-year mission. Travel through time and witness the changes firsthand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(locations).map(([key, location]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  variant={selectedLocation === key ? "default" : "outline"}
                  className={`h-20 flex-col space-y-2 transition-all ${
                    selectedLocation === key
                      ? 'bg-gradient-terra text-white space-glow'
                      : 'border-primary/30 hover:bg-primary/10'
                  }`}
                >
                  <div className="font-bold text-lg">{location.name.split(',')[0]}</div>
                  <div className="text-sm opacity-75">+{location.tempIncrease}°C warmer</div>
                </Button>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
                    <div className="flex items-center">
                      <Eye className="w-6 h-6 mr-2 text-primary" />
                      Virtual Reality Time Travel
                    </div>
                    <Badge variant="outline" className="border-primary/30">
                      Use time slider to explore 2000-2025
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VRExperience location={selectedLocation} year={vrYear} />
                </CardContent>
              </Card>
              
              {/* VR Statistics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Temperature Change',
                    value: `+${(((vrYear - 2000) / 25) * locations[selectedLocation as keyof typeof locations].tempIncrease).toFixed(1)}°C`,
                    icon: Thermometer,
                    color: 'destructive'
                  },
                  {
                    title: 'Urban Growth',
                    value: `${(((vrYear - 2000) / 25) * 100).toFixed(0)}%`,
                    icon: Building,
                    color: 'warning'
                  },
                  {
                    title: 'Hot Days/Year',
                    value: Math.floor(110 + ((vrYear - 2000) / 25) * 35),
                    icon: Activity,
                    color: 'destructive'
                  },
                  {
                    title: 'Terra Monitoring',
                    value: `${vrYear - 1999} years`,
                    icon: Satellite,
                    color: 'primary'
                  }
                ].map((stat, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}`} />
                      <div className={`text-2xl font-bold text-${stat.color} mb-1`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.title}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Solutions Section */}
        {currentSection === 'solutions' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Global Winning Solutions</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Terra's data reveals not just problems, but pathways to cooler, more sustainable cities worldwide
              </p>
            </div>

            {/* Hero Solution Card */}
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coolCity})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-success/80 via-primary/60 to-terra-purple/80" />
              <div className="relative p-12 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 space-glow">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">The Comprehensive Cool City Strategy</h3>
                <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Based on 25 years of Terra satellite data, we've identified a winning formula that can reduce urban 
                  temperatures by 3-7°C and create healthier, more livable cities for billions of people.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">3-7°C</div>
                    <div className="text-white/80 text-sm">Temperature Reduction Possible</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">3.8B</div>
                    <div className="text-white/80 text-sm">People Who Could Benefit</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">25 Years</div>
                    <div className="text-white/80 text-sm">of Terra Data Guiding Solutions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Nature-Based Solutions */}
              <Card className="border-success/30 hover:border-success transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <TreePine className="w-8 h-8 mr-3 text-success" />
                    Green Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Urban forests: 30% tree coverage reduces temperatures by 2-8°C',
                    'Green roofs and walls: Living buildings that naturally cool',
                    'Parks and corridors: Connected green spaces for maximum impact',
                    'Wetland restoration: Natural cooling and flood protection'
                  ].map((solution, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{solution}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Smart Materials */}
              <Card className="border-warning/30 hover:border-warning transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Zap className="w-8 h-8 mr-3 text-warning" />
                    Smart Materials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Cool pavements: Reflective surfaces reduce heat absorption by 50%',
                    'White/light roofs: Simple solution with 3-5°C cooling effect',
                    'Permeable surfaces: Allow natural cooling through evaporation',
                    'Phase-change materials: Buildings that self-regulate temperature'
                  ].map((solution, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{solution}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Urban Design */}
              <Card className="border-primary/30 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Building className="w-8 h-8 mr-3 text-primary" />
                    Smart Urban Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Wind corridors: Strategic building placement for natural ventilation',
                    'Compact development: Reduce sprawl and preserve natural cooling',
                    'Water features: Fountains, ponds create localized cooling',
                    'Shade structures: Strategic coverage for pedestrian areas'
                  ].map((solution, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{solution}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

            {/* Success Stories */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground text-center">
                  Success Stories: Cities Leading the Way
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-success/20 to-success/10 border-success/30">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-foreground mb-3 flex items-center">
                        <TreePine className="w-6 h-6 mr-2 text-success" />
                        Singapore: The Garden City
                      </h4>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        50% green coverage, mandatory green building standards, and innovative vertical gardens have kept 
                        temperatures stable despite rapid development.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-success">-2.5°C</div>
                          <div className="text-sm text-muted-foreground">Cooler than predicted</div>
                        </div>
                        <Badge variant="outline" className="border-success/30 text-success">
                          Terra Verified
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-foreground mb-3 flex items-center">
                        <Wind className="w-6 h-6 mr-2 text-primary" />
                        Copenhagen: The Cool Capital
                      </h4>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        District cooling systems, extensive cycling infrastructure, and blue-green infrastructure have 
                        created Europe's most climate-resilient city.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-primary">-3.1°C</div>
                          <div className="text-sm text-muted-foreground">Below regional trend</div>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          Terra Verified
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Global Implementation Roadmap */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-terra-purple/5">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground text-center">
                  Global Implementation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      phase: 'Phase 1: 2025-2030',
                      title: 'Emergency Response',
                      description: 'Emergency interventions in 50 hottest cities. Cool pavements, tree planting, white roofs.',
                      target: '2°C reduction',
                      icon: Calendar,
                      color: 'destructive'
                    },
                    {
                      phase: 'Phase 2: 2030-2040',
                      title: 'Comprehensive Redesign',
                      description: 'Comprehensive redesign of 200 major cities. Green infrastructure, smart materials, urban planning reform.',
                      target: '4°C reduction',
                      icon: Target,
                      color: 'warning'
                    },
                    {
                      phase: 'Phase 3: 2040-2050',
                      title: 'Global Transformation',
                      description: 'Global transformation complete. All major cities implementing cool city standards.',
                      target: '7°C reduction',
                      icon: Star,
                      color: 'success'
                    }
                  ].map((phase, index) => (
                    <Card key={index} className={`border-${phase.color}/30 hover:border-${phase.color} transition-all`}>
                      <CardContent className="p-6 text-center space-y-4">
                        <div className={`w-16 h-16 bg-${phase.color}/20 rounded-full flex items-center justify-center mx-auto`}>
                          <phase.icon className={`w-8 h-8 text-${phase.color}`} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-2">{phase.phase}</h4>
                          <h5 className={`text-md font-semibold text-${phase.color} mb-2`}>{phase.title}</h5>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{phase.description}</p>
                          <Badge variant="outline" className={`border-${phase.color}/30 text-${phase.color}`}>
                            Target: {phase.target}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="border-destructive/30 bg-gradient-to-r from-destructive/10 to-warning/10">
              <CardContent className="p-8 text-center space-y-6">
                <h3 className="text-3xl font-bold text-foreground">The Time Is Now</h3>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Terra's 25 years of data show us exactly what works. We have the knowledge, the technology, and the urgent need. 
                  The question isn't whether we can cool our cities—it's whether we will act fast enough to save lives and create a sustainable future.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-destructive/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-destructive">3.8 billion</div>
                    <div className="text-sm text-muted-foreground">People at risk from urban heat</div>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-warning">$2.4 trillion</div>
                    <div className="text-sm text-muted-foreground">Annual economic losses from heat</div>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-destructive">5 years</div>
                    <div className="text-sm text-muted-foreground">Window for emergency action</div>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentSection('intro')}
                  className="bg-gradient-terra hover:opacity-90 text-white px-8 py-3 text-lg space-glow"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Begin Your Terra Mission
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerraInteractiveSystem;