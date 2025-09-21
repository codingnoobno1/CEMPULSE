'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Modal,
    Button,
    Alert,
    CircularProgress,
    Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, AlertTriangle, Brain } from 'lucide-react';
import { fetchGeminiAnalysis, requestManagerApproval } from '@/services/api';

export default function BaseProcessCard({ 
    process, 
    ProcessSpecificContent, 
    fetchProcessSpecificData 
}) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [processData, setProcessData] = useState(null);
    const [geminiAnalysis, setGeminiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProcessSpecificData();
                // If API returns null or undefined, the ProcessSpecificContent will use its dummy data
                setProcessData(data);
            } catch (error) {
                console.error('Error loading process data:', error);
                // On error, set processData to null so component uses dummy data
                setProcessData(null);
                setSnackbar({
                    open: true,
                    message: 'Using offline data',
                    severity: 'info'
                });
            }
        };
        loadData();
    }, []);

    const handleGeminiAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const analysis = await fetchGeminiAnalysis(processData);
            setGeminiAnalysis(analysis);
            setSnackbar({
                open: true,
                message: 'Gemini analysis completed',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to get Gemini analysis',
                severity: 'error'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleManagerApproval = async () => {
        try {
            const result = await requestManagerApproval(process.id, geminiAnalysis);
            setApprovalStatus(result.status);
            setSnackbar({
                open: true,
                message: 'Approval request sent to manager',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to request approval',
                severity: 'error'
            });
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95vw',
        height: '95vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2
    };

    const CardWrapper = motion(Card);

    return (
        <>
            <CardWrapper
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                sx={{ position: 'relative', height: '100%' }}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                            {process.stage}. {process.name}
                        </Typography>
                        <Box>
                            <IconButton 
                                color="primary" 
                                onClick={handleGeminiAnalysis}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? <CircularProgress size={24} /> : <Brain />}
                            </IconButton>
                            <IconButton onClick={() => setIsFullScreen(true)}>
                                <Maximize2 />
                            </IconButton>
                        </Box>
                    </Box>

                    {ProcessSpecificContent && <ProcessSpecificContent data={processData} />}

                    {geminiAnalysis && (
                        <Box mt={2}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                {geminiAnalysis.analysis}
                            </Alert>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleManagerApproval}
                                disabled={!!approvalStatus}
                            >
                                {approvalStatus === 'pending' ? 'Approval Pending' : 'Request Manager Approval'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </CardWrapper>

            <Modal
                open={isFullScreen}
                onClose={() => setIsFullScreen(false)}
            >
                <Box sx={modalStyle}>
                    {/* Your existing modal content */}
                </Box>
            </Modal>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
