import React, { createContext, useContext, useState, ReactNode } from 'react';


interface ProviderInfo {
    name: string;
    email: string;
    phone: string;
}

interface AppDataContextType {
    activityData: Record<string, any>;
    setActivityData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    resultsData: Record<string, any>;
    setResultsData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    providerInfo: ProviderInfo;
    setProviderInfo: React.Dispatch<React.SetStateAction<ProviderInfo>>;
    sendPdfToProvider: (pdfBlob: Blob) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};

interface AppDataProviderProps {
    children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
    const [activityData, setActivityData] = useState<Record<string, any>>({});
    const [resultsData, setResultsData] = useState<Record<string, any>>({});
    const [providerInfo, setProviderInfo] = useState<ProviderInfo>({
        name: '',
        email: '',
        phone: ''
    });

    // Example: function to send PDF (implementation depends on your app)
    const sendPdfToProvider = (pdfBlob: Blob) => {
        // Implement sending logic here (e.g., API call or email integration)
    };

    return (
        <AppDataContext.Provider value={{
            activityData,
            setActivityData,
            resultsData,
            setResultsData,
            providerInfo,
            setProviderInfo,
            sendPdfToProvider
        }}>
            {children}
            {/* Button to go back to dashboard */}
            <div style={{ marginTop: 32, textAlign: 'center' }}>
                <a href="/dashboard">
                    <button type="button">
                        Back to Dashboard
                    </button>
                </a>
            </div>
        </AppDataContext.Provider>
    );};