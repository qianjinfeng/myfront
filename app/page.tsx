'use client'

import React from 'react';
import { EuiTitle, EuiText, EuiButton } from '@elastic/eui';

export default function HomePage() {
  return (
    <div>
      <EuiTitle>
        <h1>Welcome to the Home Page</h1>
      </EuiTitle>
      <EuiText>
        <p>This is the home page of your application.</p>
      </EuiText>
      <EuiButton href="/dashboard">Go to Dashboard</EuiButton>
    </div>
  );
}
