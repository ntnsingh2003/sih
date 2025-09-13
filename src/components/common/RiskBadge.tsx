import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  risk: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md', showIcon = true }) => {
  const getConfig = () => {
    switch (risk) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          text: 'High Risk',
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertCircle,
          text: 'Medium Risk',
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          text: 'Low Risk',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${config.color} ${getSizeClasses()}`}>
      {showIcon && <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />}
      {config.text}
    </span>
  );
};

export default RiskBadge;