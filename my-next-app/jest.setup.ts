// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// You can add other global setup code here if needed
// For example, polyfills or global mocks

// Example: Mocking Next.js router for components that use it
// jest.mock('next/router', () => require('next-router-mock'));

// Example: Mocking Next.js Link component (if not handled by next/jest)
// jest.mock('next/link', () => {
//  return ({children, href}: {children: React.ReactNode, href: string}) => {
//    return <a href={href}>{children}</a>;
//  };
// });

// Silence console.error and console.log during tests if desired
// (useful if there are expected errors or lots of logging)
//
// let originalError: any, originalLog: any;
// beforeEach(() => {
//   originalError = console.error;
//   originalLog = console.log;
//   console.error = jest.fn();
//   console.log = jest.fn();
// });
//
// afterEach(() => {
//   console.error = originalError;
//   console.log = originalLog;
// });
