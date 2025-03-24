import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import { getAnalyticsMetrics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const metrics = await getAnalyticsMetrics();

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Views Today</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.viewsToday.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Views This Month
            </CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.viewsThisMonth.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Views This Year
            </CardTitle>
            <Calendar className="w- h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.viewsThisYear.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Daily Views
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageDailyViews.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Monthly Views
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageMonthlyViews.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
