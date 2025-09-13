import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'blue' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getChangeColor = () => {
    switch (change?.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;