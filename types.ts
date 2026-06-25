export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  condition: string;
  conditionIcon: string;
  lastUpdated: string;
}

export interface ForecastDay {
  date: string;
  condition: string;
  conditionIcon: string;
  tempMin: number;
  tempMax: number;
  rainProb: number;
  windSpeed: number;
}

export interface ComfortInfo {
  comfortIndex: number;
  comfortExplanation: string;
  weatherMood: string;
  weatherMoodExplanation: string;
}

export interface YesterdayComparison {
  tempDiff: number;
  yesterdayTemp: number;
  diffText: string;
}

export interface ReadinessInfo {
  score: number;
  explanation: string;
}

export interface ImpactScores {
  travel: number;
  outdoor: number;
  running: number;
  cycling: number;
  photography: number;
}

export interface PackingAssistant {
  bring: string[];
  avoid: string[];
}

export interface TripPlanner {
  bestVisitTime: string;
  bestWalkWindow: string;
  bestPhotography: string;
  bestSightseeing: string;
  bestSports: string;
}

export interface TravelVideo {
  title: string;
  embedId: string;
  description: string;
}

export interface DiscoveryInfo {
  famousLandmarks: string[];
  travelVideos: TravelVideo[];
  quickFacts: string[];
  localTimezone: string;
}

export interface EventRisk {
  risk: string;
  rainProb: number;
  suitability: string;
  advice: string;
}

export interface EventRisks {
  wedding: EventRisk;
  trek: EventRisk;
  picnic: EventRisk;
  cricket: EventRisk;
  roadTrip: EventRisk;
}

export interface HealthAndSafety {
  healthAdvisor: string[];
  severeWeatherSafety: string[];
}

export interface StudentPlanner {
  leaveHomeTime: string;
  studyPeriods: string;
  exercisePeriods: string;
  commuteAlert: string;
}

export interface CarbonRecommendation {
  mode: string;
  icon: string;
  impact: string;
  score: number;
}

export interface CarbonFriendly {
  recommendations: CarbonRecommendation[];
}

export interface AirQuality {
  aqi: number;
  label: string;
  advice: string;
}

export interface WeatherData {
  locationName: string;
  current: WeatherCurrent;
  forecast: ForecastDay[];
  comfort: ComfortInfo;
  yesterday: YesterdayComparison;
  readiness: ReadinessInfo;
  impactScores: ImpactScores;
  packing: PackingAssistant;
  tripPlanner: TripPlanner;
  discovery: DiscoveryInfo;
  events: EventRisks;
  health: HealthAndSafety;
  studentPlanner: StudentPlanner;
  carbonFriendly: CarbonFriendly;
  airQuality?: AirQuality;
}

export interface HistoryRecord {
  id: string;
  location: string;
  coordinates: { lat: number; lon: number };
  weatherSummary: string;
  searchTimestamp: string;
  notes: string;
  travelPlans: string;
  weatherData: WeatherData;
  startDate?: string;
  endDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface DashboardAnalytics {
  totalSearches: number;
  mostSearchedLocation: string;
  avgTemp: number;
  hottestLocation: string;
  rainiestLocation: string;
  trends: Array<{
    location: string;
    date: string;
    temp: number;
    condition: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  metric: string;
}
