import React from 'react';
import Card, { CardContent } from './Card';

const StatCard = ({ title, value, icon: Icon, trend, className = '' }) => {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-secondary">{title}</p>
          {Icon && <Icon className="text-secondary" size={16} />}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <h4 className="text-2xl font-semibold tracking-tight">{value}</h4>
          {trend && (
            <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
