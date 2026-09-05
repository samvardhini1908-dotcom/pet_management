import React from 'react';
import { useSelector } from 'react-redux';

const ErrorHandler = ({ error: propError }) => {
  // Reads errors from Redux state (checks root and common nested slice locations)
  const reduxErrors = useSelector((state) => {
    const authError = state?.authError ?? state?.auth?.authError ?? state?.auth?.error;
    const collectionError =
      state?.collectionError ?? state?.collection?.collectionError ?? state?.collection?.error;
    const facilityError =
      state?.facilityError ?? state?.facility?.facilityError ?? state?.facility?.error;

    return authError || collectionError || facilityError;
  });

  // Extract raw error string from props or Redux state
  const activeError = propError || reduxErrors;

  if (!activeError) {
    return null;
  }

  const errorMessage =
    typeof activeError === 'string'
      ? activeError
      : activeError?.message || JSON.stringify(activeError);

  // Check if error contains "Pet" or "Vaccination" keywords
  const hasPetOrVaccination =
    errorMessage.includes('Pet') || errorMessage.includes('Vaccination');

  const displayMessage = hasPetOrVaccination
    ? 'Pet-specific failure during Vaccination load'
    : errorMessage;

  return (
    <div
      role="alert"
      style={{
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        padding: '12px 16px',
        margin: '12px 0',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {displayMessage}
    </div>
  );
};

export default ErrorHandler;