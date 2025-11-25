// Mock RV Companies Data
export const companies = [
  { id: 1, name: "Camping World", type: "service", region: "National" },
  { id: 2, name: "Lazy Days RV", type: "service", region: "Southeast" },
  { id: 3, name: "General RV Center", type: "retail", region: "Midwest" },
  { id: 4, name: "Motor Home Specialist", type: "retail", region: "Texas" },
  { id: 5, name: "MHSRV", type: "retail", region: "Texas" },
  { id: 6, name: "Keystone RV", type: "service", region: "Indiana" },
  { id: 7, name: "Jacyco RV", type: "service", region: "National" },
  { id: 8, name: "Thor Industries", type: "retail", region: "Indiana" },
  { id: 9, name: "Winnebago", type: "retail", region: "Iowa" },
  { id: 10, name: "Forest River", type: "service", region: "Indiana" },
  { id: 11, name: "Airstream", type: "retail", region: "Ohio" },
  { id: 12, name: "Coachmen RV", type: "service", region: "Indiana" },
  { id: 13, name: "Jayco", type: "retail", region: "Indiana" },
  { id: 14, name: "Grand Design RV", type: "retail", region: "Indiana" },
  { id: 15, name: "Newmar Corporation", type: "service", region: "Indiana" },
  { id: 16, name: "Tiffin Motorhomes", type: "service", region: "Alabama" },
  { id: 17, name: "American Coach", type: "retail", region: "Indiana" },
  { id: 18, name: "Fleetwood RV", type: "service", region: "Indiana" },
  { id: 19, name: "Monaco RV", type: "retail", region: "Indiana" },
  { id: 20, name: "Holiday Rambler", type: "service", region: "Indiana" },
  { id: 21, name: "Entegra Coach", type: "retail", region: "Indiana" },
  { id: 22, name: "DRV Luxury Suites", type: "service", region: "Indiana" },
  { id: 23, name: "Heartland RV", type: "retail", region: "Indiana" },
  { id: 24, name: "Highland Ridge RV", type: "service", region: "Indiana" },
  { id: 25, name: "CrossRoads RV", type: "retail", region: "Indiana" },
  { id: 26, name: "Prime Time Manufacturing", type: "service", region: "Indiana" },
  { id: 27, name: "Palomino RV", type: "retail", region: "Indiana" },
  { id: 28, name: "Dutchmen RV", type: "service", region: "Indiana" },
  { id: 29, name: "Starcraft RV", type: "retail", region: "Indiana" },
  { id: 30, name: "Venture RV", type: "service", region: "Indiana" },
  { id: 31, name: "KZ RV", type: "retail", region: "Indiana" },
  { id: 32, name: "Cruiser RV", type: "service", region: "Indiana" },
  { id: 33, name: "Gulf Stream Coach", type: "retail", region: "Indiana" },
  { id: 34, name: "Lance Campers", type: "service", region: "California" },
  { id: 35, name: "Northwood Manufacturing", type: "retail", region: "Oregon" },
  { id: 36, name: "Oliver Travel Trailers", type: "service", region: "Tennessee" },
  { id: 37, name: "Pleasure-Way Industries", type: "retail", region: "Canada" },
  { id: 38, name: "Roadtrek", type: "service", region: "Canada" },
  { id: 39, name: "Leisure Travel Vans", type: "retail", region: "Canada" },
  { id: 40, name: "Renegade RV", type: "service", region: "Minnesota" },
  { id: 41, name: "NeXus RV", type: "retail", region: "Indiana" },
  { id: 42, name: "Phoenix USA RV", type: "service", region: "Indiana" },
  { id: 43, name: "Dynamax Corporation", type: "retail", region: "Indiana" },
  { id: 44, name: "Midwest Automotive Designs", type: "service", region: "Indiana" },
  { id: 45, name: "Regency RV", type: "retail", region: "Nevada" },
  { id: 46, name: "Chinook RV", type: "service", region: "Washington" },
  { id: 47, name: "Escape Trailer Industries", type: "retail", region: "Canada" },
  { id: 48, name: "nuCamp RV", type: "service", region: "Ohio" },
  { id: 49, name: "Little Guy Trailers", type: "retail", region: "Ohio" },
  { id: 50, name: "Braxton Creek", type: "service", region: "Indiana" },
  { id: 51, name: "inTech RV", type: "retail", region: "Indiana" },
  { id: 52, name: "Travel Lite RV", type: "service", region: "Indiana" },
  { id: 53, name: "Sunset Park RV", type: "retail", region: "Indiana" },
  { id: 54, name: "Aliner", type: "service", region: "Pennsylvania" },
  { id: 55, name: "Taxa Outdoors", type: "retail", region: "Texas" },
  { id: 56, name: "Happier Camper", type: "service", region: "California" },
  { id: 57, name: "Scamp Trailers", type: "retail", region: "Minnesota" },
  { id: 58, name: "Casita Travel Trailers", type: "service", region: "Texas" },
  { id: 59, name: "Escape POD", type: "retail", region: "Canada" },
  { id: 60, name: "Opus Camper", type: "service", region: "California" },
  { id: 61, name: "Black Series Camper", type: "retail", region: "California" },
];

export type CallStatus = "completed" | "pending" | "issue";
export type IssueType = "parts" | "motor" | "warranty" | "general" | "billing";

export interface CallLog {
  id: string;
  companyId: number;
  companyName: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  duration: string;
  status: CallStatus;
  issueType: IssueType;
  summary: string;
  hasTranscript: boolean;
  agentName: string;
  department: "retail" | "service";
}

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const agentNames = ["Alex Thompson", "Jordan Lee", "Casey Morgan", "Taylor Smith", "Riley Davis", "Morgan Johnson", "Jamie Wilson", "Quinn Brown"];

const summaries = {
  parts: [
    "Customer inquiring about replacement awning fabric availability",
    "Request for brake controller installation parts",
    "Looking for water pump replacement options",
    "Inquiry about LED light conversion kits",
    "Needs replacement slide-out motor",
    "Seeking fridge parts for 2019 model",
  ],
  motor: [
    "Engine running rough at idle, scheduled diagnostic",
    "Transmission shifting issues reported",
    "Customer reporting unusual exhaust smoke",
    "Generator maintenance inquiry",
    "AC compressor not engaging properly",
    "Leveling system malfunction reported",
  ],
  warranty: [
    "Extended warranty claim for roof leak",
    "Warranty status check for appliances",
    "Filing claim for slide-out seal failure",
    "Factory warranty coverage question",
    "Requesting warranty transfer documentation",
    "Warranty repair authorization needed",
  ],
  general: [
    "New customer orientation scheduling",
    "Questions about winterization services",
    "Campground recommendation request",
    "RV storage availability inquiry",
    "Trade-in value assessment request",
    "Annual service scheduling",
  ],
  billing: [
    "Payment plan inquiry for repairs",
    "Invoice clarification needed",
    "Requesting itemized service breakdown",
    "Extended payment options discussion",
    "Previous balance inquiry",
    "Service estimate approval",
  ],
};

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const subscriber = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${exchange}-${subscriber}`;
}

function generateDuration(): string {
  const minutes = Math.floor(Math.random() * 45) + 2;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0];
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCallLogs(count: number = 500): CallLog[] {
  const logs: CallLog[] = [];
  
  for (let i = 0; i < count; i++) {
    const company = randomElement(companies);
    const issueType = randomElement(["parts", "motor", "warranty", "general", "billing"] as IssueType[]);
    const status = randomElement(["completed", "completed", "completed", "pending", "issue"] as CallStatus[]);
    
    logs.push({
      id: `CALL-${String(i + 1).padStart(6, "0")}`,
      companyId: company.id,
      companyName: company.name,
      customerName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      phoneNumber: generatePhoneNumber(),
      date: randomDate(90),
      duration: generateDuration(),
      status,
      issueType,
      summary: randomElement(summaries[issueType]),
      hasTranscript: Math.random() > 0.3,
      agentName: randomElement(agentNames),
      department: company.type as "retail" | "service",
    });
  }
  
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const callLogs = generateCallLogs(500);

// Dashboard Statistics
export const dashboardStats = {
  totalCalls: callLogs.length,
  completedCalls: callLogs.filter(c => c.status === "completed").length,
  pendingCalls: callLogs.filter(c => c.status === "pending").length,
  issues: callLogs.filter(c => c.status === "issue").length,
  avgDuration: "12:34",
  totalCompanies: companies.length,
  retailCompanies: companies.filter(c => c.type === "retail").length,
  serviceCompanies: companies.filter(c => c.type === "service").length,
};

// Sample transcripts
export const sampleTranscripts: Record<string, string> = {
  "CALL-000001": `Agent: Thank you for calling RV Support, this is Alex. How can I help you today?

Customer: Hi Alex, I'm calling about my 2021 Keystone Cougar. I'm having issues with my slide-out.

Agent: I'm sorry to hear that. Can you describe what's happening with the slide-out?

Customer: When I try to extend it, it makes a grinding noise and only goes about halfway out.

Agent: That does sound like it could be an issue with the slide-out motor or possibly the gear mechanism. Have you noticed any debris or obstructions in the track?

Customer: I checked and the track looks clear.

Agent: Alright, I'd recommend bringing it in for a diagnostic. We can get you scheduled as early as next Tuesday. Would that work for you?

Customer: Yes, Tuesday works great.

Agent: Perfect. I've got you scheduled for Tuesday at 9 AM. Is there anything else I can help with?

Customer: No, that's all. Thank you!

Agent: You're welcome. We'll see you Tuesday. Have a great day!`,
};
