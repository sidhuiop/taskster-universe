
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  ListChecks, 
  AlertCircle 
} from "lucide-react";
import { TaskStats } from '@/lib/types';

interface DashboardProps {
  stats: TaskStats;
}

const Dashboard = ({ stats }: DashboardProps) => {
  // Prepare data for category chart
  const categoryData = [
    {
      name: 'Work',
      value: stats.byCategory.work,
      fill: '#4F46E5',
    },
    {
      name: 'Personal',
      value: stats.byCategory.personal,
      fill: '#10B981',
    },
    {
      name: 'Urgent',
      value: stats.byCategory.urgent,
      fill: '#EF4444',
    },
  ];

  // Prepare data for priority chart
  const priorityData = [
    {
      name: 'High',
      value: stats.byPriority.high,
      fill: '#EF4444',
    },
    {
      name: 'Medium',
      value: stats.byPriority.medium,
      fill: '#F59E0B',
    },
    {
      name: 'Low',
      value: stats.byPriority.low,
      fill: '#10B981',
    },
  ];

  // Calculate completion percentage
  const completionPercentage = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <StatCard 
          title="Total Tasks"
          value={stats.total}
          icon={<ListChecks className="h-5 w-5 text-blue-500" />}
          description="All tasks"
          trend={null}
        />
        
        {/* Completed Tasks Card */}
        <StatCard 
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          description={`${completionPercentage}% completion rate`}
          trend={null}
        />
        
        {/* Pending Tasks Card */}
        <StatCard 
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Tasks in progress"
          trend={null}
        />
        
        {/* Overdue Tasks Card */}
        <StatCard 
          title="Overdue"
          value={stats.overdue}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          description="Tasks past due date"
          trend={null}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total > 0 ? (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} tasks`, 'Count']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                        padding: '8px 12px' 
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Priority Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total > 0 ? (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} tasks`, 'Count']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                        padding: '8px 12px' 
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend: { value: number; positive: boolean } | null;
}

const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && (
        <div className={`text-xs mt-2 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </CardContent>
  </Card>
);

export default Dashboard;
