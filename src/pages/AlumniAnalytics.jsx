import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Building2,
  MapPin,
  TrendingUp,
  PieChart,
  BarChart3,
  Map as MapIcon,
  Calendar,
  GraduationCap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function AlumniAnalytics({
  isDarkMode,
  toggleTheme,
  isAuthenticated,
}) {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  // Initialize with default empty data to prevent errors
  const defaultChartData = {
    growthData: [],
    branchChartData: [],
    locationChartData: [],
    companyChartData: [],
    experienceChartData: [],
    monthlyTrendData: [],
  };

  const [chartData, setChartData] = useState(defaultChartData);

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        // Get token for authentication check
        const storedAuth = localStorage.getItem("auth");
        let headers = {
          "Content-Type": "application/json",
        };

        if (storedAuth) {
          try {
            const authData = JSON.parse(storedAuth);
            if (authData?.accessToken) {
              headers["Authorization"] = `Bearer ${authData.accessToken}`;
            }
          } catch (e) {
            console.error("Error parsing auth data:", e);
          }
        }

        const response = await fetch(`${BASE_URL}/alumni/all-alumni`, { headers });
        const result = await response.json();
        if (result.success && result.data) {
          setAlumniData(result.data);
          processChartData(result.data);
        } else {
          setAlumniData([]);
          setChartData(defaultChartData);
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setAlumniData([]);
        setChartData(defaultChartData);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Process data for charts
  const processChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData(defaultChartData);
      return;
    }

    // Year-wise growth data
    const yearCounts = {};
    data.forEach((alumni) => {
      const year = new Date(alumni.createdAt || Date.now()).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const growthData = Object.keys(yearCounts)
      .sort()
      .map((year) => ({
        year: parseInt(year),
        alumni: yearCounts[year],
        cumulative: Object.keys(yearCounts)
          .filter((y) => parseInt(y) <= parseInt(year))
          .reduce((sum, y) => sum + yearCounts[y], 0),
      }));

    // Branch distribution
    const branchData = data.reduce((acc, alumni) => {
      const branch = alumni.profile?.branch || "Unknown";
      acc[branch] = (acc[branch] || 0) + 1;
      return acc;
    }, {});

    const branchChartData = Object.entries(branchData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Location distribution
    const locationData = data.reduce((acc, alumni) => {
      const location = alumni.profile?.location || "Unknown";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const locationChartData = Object.entries(locationData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Company distribution
    const companyData = {};
    data.forEach((alumni) => {
      const experiences = alumni.profile?.experience || [];
      experiences.forEach((exp) => {
        if (exp.company) {
          companyData[exp.company] = (companyData[exp.company] || 0) + 1;
        }
      });
    });

    const companyChartData = Object.entries(companyData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Experience level distribution
    const experienceData = {
      "0-2 years": 0,
      "2-5 years": 0,
      "5-10 years": 0,
      "10+ years": 0,
    };

    data.forEach((alumni) => {
      const experiences = alumni.profile?.experience || [];
      let totalExperience = 0;

      experiences.forEach((exp) => {
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = exp.current ? new Date() : new Date(exp.endDate);
          const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
          totalExperience += years;
        }
      });

      if (totalExperience <= 2) experienceData["0-2 years"]++;
      else if (totalExperience <= 5) experienceData["2-5 years"]++;
      else if (totalExperience <= 10) experienceData["5-10 years"]++;
      else experienceData["10+ years"]++;
    });

    const experienceChartData = Object.entries(experienceData).map(
      ([name, value]) => ({ name, value })
    );

    // Monthly registration trend (last 12 months)
    const monthlyData = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthlyData[key] = 0;
    }

    data.forEach((alumni) => {
      const date = new Date(alumni.createdAt || Date.now());
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key]++;
      }
    });

    const monthlyTrendData = Object.entries(monthlyData).map(
      ([month, count]) => ({
        month: month.split("-")[1] + "/" + month.split("-")[0].slice(2),
        registrations: count,
      })
    );

    setChartData({
      growthData,
      branchChartData,
      locationChartData,
      companyChartData,
      experienceChartData,
      monthlyTrendData,
    });
  };

  // Colors for charts
  const colors = {
    primary: isDarkMode ? "#8884d8" : "#6366f1",
    secondary: isDarkMode ? "#82ca9d" : "#10b981",
    accent: isDarkMode ? "#ffc658" : "#f59e0b",
    danger: isDarkMode ? "#ff8042" : "#ef4444",
    success: isDarkMode ? "#00C49F" : "#22c55e",
  };

  const pieColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ];

  const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
            } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-500 ${isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
          }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <p
              className={
                isDarkMode ? "text-white text-lg" : "text-gray-900 text-lg"
              }
            >
              Loading Analytics Data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No alumni data found
  if (alumniData.length === 0) {
    return (
      <div
        className={`min-h-screen transition-colors duration-500 ${isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
          }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <section className="container mx-auto px-4 md:px-10 lg:px-16 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Alumni Analytics
              </h1>
            </div>
            <p
              className={`text-lg sm:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                } max-w-2xl mx-auto`}
            >
              Comprehensive insights and trends about our alumni community
            </p>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mt-4"></div>
          </div>

          {/* No Data Found */}
          <div
            className={`max-w-2xl mx-auto p-8 rounded-2xl border text-center ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2">
              No Alumni Found for Analysis
            </h2>
            <p
              className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Start by adding alumni profiles to view analytics and insights
              about your community.
            </p>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              Add First Alumni
            </button>
          </div>

          {/* Empty Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: "Total Alumni",
                value: "0",
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "Branches",
                value: "0",
                icon: GraduationCap,
                color: "from-purple-500 to-pink-500",
              },
              {
                label: "Cities",
                value: "0",
                icon: MapPin,
                color: "from-green-500 to-emerald-500",
              },
              {
                label: "Companies",
                value: "0",
                icon: Building2,
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p
                  className={`text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  // Main analytics with data
  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <section className="container mx-auto px-4 md:px-10 lg:px-16 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Alumni Analytics
            </h1>
          </div>
          <p
            className={`text-lg sm:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
          >
            Comprehensive insights and trends about our alumni community
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            {
              label: "Total Alumni",
              value: alumniData.length,
              icon: Users,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Branches",
              value: new Set(alumniData.map((a) => a.profile?.branch)).size,
              icon: GraduationCap,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Cities",
              value: new Set(alumniData.map((a) => a.profile?.location)).size,
              icon: MapPin,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Companies",
              value: new Set(
                alumniData.flatMap(
                  (a) => a.profile?.experience?.map((exp) => exp.company) || []
                )
              ).size,
              icon: Building2,
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 md:p-6 rounded-xl md:rounded-2xl border transition-all hover:scale-105 hover:shadow-xl md:hover:shadow-2xl ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-md md:shadow-lg"
                }`}
            >
              <div
                className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 md:mb-4 shadow-lg`}
              >
                <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <p
                className={`text-lg md:text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
              <p
                className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alumni Growth Over Time */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold">Alumni Growth Over Time</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.growthData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="year"
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke={colors.primary}
                    fill={colors.primary}
                    fillOpacity={0.3}
                    name="Total Alumni"
                  />
                  <Bar
                    dataKey="alumni"
                    fill={colors.secondary}
                    name="New Alumni"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Branch Distribution */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold">Branch Distribution</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData.branchChartData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(chartData.branchChartData || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Locations */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapIcon className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold">Top Locations</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.locationChartData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Bar
                    dataKey="value"
                    fill={colors.success}
                    name="Alumni Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Companies */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold">Top Companies</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.companyChartData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Bar
                    dataKey="value"
                    fill={colors.accent}
                    name="Alumni Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Experience Level Distribution */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">Experience Distribution</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.experienceChartData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Bar
                    dataKey="value"
                    fill={colors.danger}
                    name="Alumni Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Registration Trend */}
          <div
            className={`p-4 md:p-6 rounded-2xl border ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold">Monthly Registrations</h3>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.monthlyTrendData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke={colors.primary}
                    strokeWidth={2}
                    name="Registrations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div
          className={`p-4 md:p-6 rounded-2xl border mb-8 ${isDarkMode
            ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
            : "bg-white border-blue-200 shadow-lg"
            }`}
        >
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div
                className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
              >
                {alumniData.length}
              </div>
              <div
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Total Alumni
              </div>
            </div>
            <div className="text-center p-4">
              <div
                className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
              >
                {new Set(alumniData.map((a) => a.profile?.location)).size}
              </div>
              <div
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Cities Covered
              </div>
            </div>
            <div className="text-center p-4">
              <div
                className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
              >
                {
                  new Set(
                    alumniData.flatMap(
                      (a) =>
                        a.profile?.experience?.map((exp) => exp.company) || []
                    )
                  ).size
                }
              </div>
              <div
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Companies
              </div>
            </div>
            <div className="text-center p-4">
              <div
                className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-orange-400" : "text-orange-600"
                  }`}
              >
                {new Set(alumniData.map((a) => a.profile?.branch)).size}
              </div>
              <div
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Branches
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}