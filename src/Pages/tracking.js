import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Hash,
    Search,
    Clock,
    MapPin,
    Plane,
    Truck,
    CheckCircle,
    Package,
    Download,
    Copy,
    RefreshCw // NEW: used by the new search button / loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../Components/SEO'; // NEW: from new code
import { business } from '../lib/business'; // NEW: used by "Call for help" link

// --- Configuration Constants ---
const COLORS = {
    primary: "#175d29", // Dark green
    secondary: "#f9a825", // Amber
};

// Simplified and ordered progress steps as requested
const PROGRESS_STEPS = ['BOOKED', 'IN_TRANSIT', 'WAREHOUSE_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERED'];

// Base URL for your tracking API
const API_BASE_URL = "https://panchathanlogistics.com/billing_php/index.php/multi_tracking_web";
// Base URL for your tracking API
const POD_API_BASE_URL = "https://panchathanlogistics.com/billing_php/index.php/get_pod_image"; // New POD API Base URL
// --- Utility Functions ---

/**
 * Maps an API status to a simplified, display-friendly status.
 * This function consolidates multiple API statuses into the defined PROGRESS_STEPS.
 * @param {string} apiStatus The primary status from the API.
 * @param {string} apiRemark Additional remarks from the API.
 * @param {string} apiLocation Location info from the API.
 * @returns {string} One of 'BOOKED', 'IN_TRANSIT', 'WAREHOUSE_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERED', or 'UNKNOWN'.
 */
const mapApiStatusToFriendlyStatus = (apiStatus, apiRemark, apiLocation) => {
    const statusUpper = (apiStatus || '').toUpperCase().trim();
    const remarkUpper = (apiRemark || '').toUpperCase().trim();
    const locationUpper = (apiLocation || '').toUpperCase().trim();

    // BOOKED status
    if (statusUpper.includes('BOOKED') || statusUpper.includes('CREATED') || remarkUpper.includes('CREATED') || locationUpper.includes('BRANCH') || statusUpper.includes('INSERTED') || statusUpper.includes('PENDING')) {
        return 'BOOKED';
    }

    // IN_TRANSIT status (combines various transit, pickup, and warehouse/customs states)
    if (statusUpper.includes('PICKED_UP') || statusUpper.includes('PU') || statusUpper.includes('RECEIVED') || statusUpper.includes('RCV') || statusUpper.includes('MANIFESTED') ||
        statusUpper.includes('IN_TRANSIT') || statusUpper.includes('TRN') || statusUpper.includes('DEPARTED') || statusUpper.includes('MOVING') || statusUpper.includes('FORWARDED') || statusUpper.includes('FWD') ||
        statusUpper.includes('TRANSIT_CLEARANCE') || statusUpper.includes('ARRIVAL')) {
        return 'IN_TRANSIT';
    }

    // WAREHOUSE_CLEARANCE status - New status
    if (statusUpper.includes('CUSTOMS') || statusUpper.includes('CLEARED') || statusUpper.includes('HELD') || statusUpper.includes('WAREHOUSE') || statusUpper.includes('WH_STORAGE')) {
        return 'WAREHOUSE_CLEARANCE';
    }

    // OUT_FOR_DELIVERY status
    if (statusUpper.includes('OUT_FOR_DELIVERY') || statusUpper.includes('OFD') || statusUpper.includes('DO') || statusUpper.includes('DELIVERY_OUT') || statusUpper.includes('DRS')) {
        return 'OUT_FOR_DELIVERY';
    }

    // DELIVERED status
    if (statusUpper.includes('DELIVERED') || statusUpper.includes('DLY') || statusUpper.includes('DLV') || statusUpper.includes('PROOF_OF_DELIVERY')) {
        return 'DELIVERED';
    }

    return 'UNKNOWN'; // Fallback for unmapped statuses
};

/**
 * Returns a CSS class string for status-specific coloring.
 * @param {string} status One of the friendly statuses.
 * @returns {string} Tailwind CSS classes for background, text, and border color.
 */
const getStatusColorClass = (status) => {
    switch (status) {
        case 'DELIVERED': return 'bg-green-600 text-white border-green-600';
        case 'OUT_FOR_DELIVERY': return 'bg-amber-500 text-white border-amber-500';
        case 'Warehouse Clearance': return 'bg-amber-500 text-white border-amber-500';
        case 'IN_TRANSIT': return 'bg-blue-600 text-white border-blue-600';
        case 'BOOKED': return 'bg-green-700 text-white border-green-700';
        default: return 'bg-gray-500 text-white border-gray-500'; // UNKNOWN
    }
};

/**
 * Returns a human-readable label for a given status.
 * @param {string} status The status (e.g., 'OUT_FOR_DELIVERY').
 * @returns {string} Formatted label (e.g., 'Out For Delivery').
 */
const getStatusLabel = (status) => {
    if (!status || typeof status !== "string") return "Unknown";
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Returns a short label for display on small screens.
 * @param {string} status The status.
 * @returns {string} A shortened label.
 */
const getShortStatusLabel = (status) => {
    switch (status) {
        case 'BOOKED': return 'Booked';
        case 'IN_TRANSIT': return 'In Transit';
        case 'Warehouse Clearance': return 'WFC';
        case 'OUT_FOR_DELIVERY': return 'O.F.D';
        case 'DELIVERED': return 'Delivered';
        default: return getStatusLabel(status);
    }
};

/**
 * Returns the appropriate Lucide icon component based on service type.
 * @param {string} service The service type (e.g., 'Air Cargo', 'Road Freight').
 * @returns {React.Component} Lucide icon component.
 */
const getServiceIcon = (service) => {
    return service && service.toLowerCase().includes("air") ? Plane : Truck;
};

/**
 * Formats a date-time string to display only the date part (YYYY-MM-DD).
 * @param {string} dateTimeStr The date-time string.
 * @returns {string} Formatted date or 'N/A'.
 */
const formatDateOnly = (dateTimeStr) => {
    if (!dateTimeStr || typeof dateTimeStr !== 'string') return 'N/A';
    const datePart = dateTimeStr.split(' ')[0];
    return datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : 'N/A';
};

/**
 * Copies text to the clipboard using the modern Clipboard API, with a fallback.
 * @param {string} text The text to copy.
 * @returns {Promise<void>} A promise that resolves if successful, rejects otherwise.
 */
const copyTextToClipboard = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (!successful) throw new Error('Fallback copying unsuccessful');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        throw err;
    } finally {
        document.body.removeChild(textArea);
    }
};

// --- Sub-Components ---

/**
 * Displays a visual progress bar with status dots.
 * @param {object} props
 * @param {string} props.currentStatus The current friendly status.
 * @param {string[]} props.progressSteps An array of friendly status strings defining the steps.
 */
const TrackingProgressBar = ({ currentStatus, progressSteps }) => {
    if (!progressSteps || progressSteps.length === 0) return null;

    const currentStepIndex = progressSteps.findIndex(step => step === currentStatus);
    const stepsCount = progressSteps.length;

    const progressPercentage = currentStepIndex >= 0
        ? (currentStepIndex / (stepsCount - 1)) * 100
        : 0;

    return (
        <div className="mb-12">
            <div className="relative pt-1">
                {/* Background Line */}
                <div className="h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                    {/* Filled Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ backgroundColor: COLORS.primary }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full"
                    ></motion.div>
                </div>

                {/* Status Dots and Labels */}
                <div className="absolute w-full top-1 flex justify-between -mt-1">
                    {progressSteps.map((step, index) => {
                        const isCurrent = step === currentStatus;
                        const isCompleted = index <= currentStepIndex;
                        const leftPosition = (index / (stepsCount - 1)) * 100;

                        return (
                            <div
                                key={step}
                                className="absolute flex flex-col items-center transform -translate-x-1/2"
                                style={{ left: `${leftPosition}%` }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isCompleted ? 1 : 0.7 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className={`w-4 h-4 rounded-full border-2 shadow-md
                                        ${isCompleted
                                            ? 'border-white ' + getStatusColorClass(step).split(' ')[0]
                                            : 'border-gray-300 bg-white'
                                        }
                                    `}
                                ></motion.div>
                                <span
                                    className={`text-[10px] mt-2 font-semibold whitespace-nowrap ${isCurrent ? 'text-gray-900' : 'text-gray-500'
                                        } block sm:hidden`}
                                    style={isCurrent ? { color: COLORS.primary } : {}}
                                >
                                    {getShortStatusLabel(step)}
                                </span>
                                <span
                                    className={`hidden sm:block sm:text-xs mt-2 font-semibold whitespace-nowrap ${isCurrent ? 'text-gray-900' : 'text-gray-500'
                                        }`}
                                    style={isCurrent ? { color: COLORS.primary } : {}}
                                >
                                    {getStatusLabel(step)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Base URL for your tracking API
const Tracking = () => {
    const [searchParams] = useSearchParams();
    const initialAwb = useMemo(() => String(searchParams.get('awb') || searchParams.get('data') || '').trim(), [searchParams]);
    const [awb, setAwb] = useState(initialAwb);
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [podUrl, setPodUrl] = useState(null);
    const [podAvailable, setPodAvailable] = useState(false);
    const [checkingPod, setCheckingPod] = useState(false);
    /**
         * Converts a Base64 string to a Blob object.
         * @param {string} base64 The Base64 string (e.g., 'data:image/jpeg;base64,...' or just 'iVBORw0KGgo...').
         * @param {string} mimeType The MIME type of the data (e.g., 'image/jpeg').
         * @returns {Blob} A Blob object.
         */
    const base64ToBlob = (base64, mimeType = "image/jpeg") => {
        // Remove data URI prefix if present
        const base64WithoutPrefix = base64.startsWith('data:') ? base64.split(',')[1] : base64;
        const byteCharacters = atob(base64WithoutPrefix);
        const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };
    /**
     * Handles fetching and decoding the POD image.
     */
    useEffect(() => {
        const fetchAndDecodePOD = async () => {
            // Only try to fetch POD if tracking data and AWB are available, and the shipment is DELIVERED
            if (!trackingData?.awb || trackingData.status !== 'DELIVERED') {
                setPodUrl(null); // Clear POD if AWB is missing or not delivered
                return;
            }

            setCheckingPod(true); // Indicate that we are checking for POD
            try {
                // Make a GET request to your POD API endpoint with the AWB number
                const response = await axios.get(`${POD_API_BASE_URL}?inv_no=${trackingData.awb}`);

                // Check if the API returned a successful status and data
                if (response.data && response.data.status === "success" && response.data.data) {
                    const base64Data = response.data.data;
                    // Infer MIME type from the Base64 string or default to 'image/jpeg'
                    const mimeType = base64Data.startsWith('data:image/') ? base64Data.split(';')[0].split(':')[1] : 'image/jpeg';

                    // Convert Base64 string to Blob
                    const blob = base64ToBlob(base64Data, mimeType);
                    // Create an object URL for the Blob
                    const url = URL.createObjectURL(blob);
                    setPodUrl(url); // Store the URL in state
                } else {
                    console.warn("POD API did not return valid image data:", response.data);
                    setPodUrl(null); // Clear POD URL if data is invalid
                }
            } catch (err) {
                console.error("Error fetching or decoding POD:", err);
                setPodUrl(null); // Clear POD URL on error
            } finally {
                setCheckingPod(false); // Finish checking
            }
        };

        fetchAndDecodePOD();

        // Cleanup function for object URL to prevent memory leaks
        return () => {
            if (podUrl) {
                URL.revokeObjectURL(podUrl);
            }
        };
    }, [trackingData?.awb, trackingData?.status, podUrl]); // Dependencies: Re-run when AWB, status, or podUrl changes
    /**
     * Handles copying the AWB number to the clipboard.
     * @param {string} text The AWB number to copy.
     */
    const handleCopyAwb = useCallback(async (text) => {
        try {
            await copyTextToClipboard(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset copy success message after 2 seconds
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }, []);

    /**
     * Fetches tracking data from the API.
     * @param {string} queryAwb The AWB number to track.
     */
    const fetchTrackingData = useCallback(async (queryAwb) => {
        const trimmedAwb = String(queryAwb).trim();
        if (!trimmedAwb) {
            setError(null);
            setTrackingData(null);
            setPodUrl(null);
            return;
        }

        setLoading(true);
        setError(null);
        setTrackingData(null);
        setPodUrl(null);

        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([trimmedAwb]), // API expects an array
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get raw error message
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText || 'Could not reach tracking server.'}`);
            }

            const responseData = await response.json();

            if (responseData.status === "failed" || !responseData.data || responseData.data.length === 0) {
                setError(typeof responseData.data === 'string' ? responseData.data : "AWB tracking data not found. Please double-check the number.");
                return;
            }

            const apiResult = responseData.data[0];
            let detail = apiResult.details?.[0] || {};
            const summary = apiResult.summary || [];

            // Consolidate 'detail' object with potentially missing fields
            const consolidatedDetail = {
                cnote_no: apiResult.invoice_no || detail.invoice_no,
                current_status_desc: apiResult.current_status || detail.current_status,
                transit_type_name: apiResult.transit_type_name || detail.transit_type_name || 'N/A',
                src_point: apiResult.Origin || detail.Origin || detail.src_point || 'N/A',
                dest_point: apiResult.dest_point || detail.dest_point || 'N/A',
                current_location: apiResult.wh_storage_location_name || detail.wh_storage_location_name || 'N/A',
                expected_delivery_date: apiResult.deliverydate || detail.deliverydate || 'N/A',
                carton_count: detail.total_carton || 'N/A',
                pod_url: apiResult.pod_link || apiResult.proof_of_delivery_url || detail.pod_link || null,
                shipment_weight: apiResult.total_weight || detail.carton_weight || 'N/A', // Assuming a field for weight
            };

            // Map API summary events to friendly timeline events
            let timelineEvents = summary.map(event => ({
                friendlyStatus: mapApiStatusToFriendlyStatus(event.opr_mode, event.remark, event.src_point),
                originalStatus: event.opr_mode, // Keep original for debugging if needed
                date: event.transit_date,
                time: event.transit_time,
                location: event.dest_point,
                note: event.remark || null,
            }));

            // Ensure a 'BOOKED' event is always present at the earliest recorded time
            const hasBookedEvent = timelineEvents.some(event => event.friendlyStatus === 'BOOKED');
            if (!hasBookedEvent && consolidatedDetail.cnote_no) {
                const earliestExistingEvent = timelineEvents[0];
                timelineEvents.unshift({
                    friendlyStatus: 'BOOKED',
                    originalStatus: 'BOOKED',
                    date: earliestExistingEvent?.date || formatDateOnly(new Date().toISOString()),
                    time: earliestExistingEvent?.time || '00:00:00',
                    location: consolidatedDetail.src_point,
                    note: 'Shipment booked and confirmed',
                });
            }

            // Sort timeline events chronologically (oldest first)
            timelineEvents.sort((a, b) => {
                const dateA = new Date(`${a.date || ''} ${a.time || '00:00:00'}`);
                const dateB = new Date(`${b.date || ''} ${b.time || '00:00:00'}`);
                return dateA.getTime() - dateB.getTime();
            });

            // Determine the current overall status based on the latest event that maps to a progress step
            let currentOverallStatus = 'BOOKED'; // Default
            const stepRanks = PROGRESS_STEPS.reduce((acc, step, idx) => ({ ...acc, [step]: idx }), {});

            timelineEvents.forEach(event => {
                const stepIndex = stepRanks[event.friendlyStatus];
                if (stepIndex !== undefined && stepIndex > stepRanks[currentOverallStatus]) {
                    currentOverallStatus = event.friendlyStatus;
                }
            });

            const transformedData = {
                status: currentOverallStatus,
                awb: consolidatedDetail.cnote_no,
                service: consolidatedDetail.transit_type_name,
                destination: detail.wh_storage_location_name || 'N/A', // Use consolidatedDetail for consistency
                origin: consolidatedDetail.src_point,
                current_location: consolidatedDetail.current_location,
                estimated_delivery: consolidatedDetail.expected_delivery_date,
                carton_count: consolidatedDetail.carton_count,
                shipment_weight: consolidatedDetail.shipment_weight,
                progressSteps: PROGRESS_STEPS,
                timeline: timelineEvents,
            };

            setTrackingData(transformedData);

            if (transformedData.status?.toLowerCase() === 'delivered') {
                // Even if pod_url is null, still set it (to allow button display)
                setPodUrl(consolidatedDetail?.pod_url || null);
                console.log("✅ Delivered! POD URL (may be null):", consolidatedDetail?.pod_url);
            } else {
                setPodUrl(null);
            }



        } catch (err) {
            console.error("Tracking API Error:", err);
            setError(err.message || "Failed to fetch tracking details due to a network or parsing error.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array for useCallback, as its dependencies are stable

    /**
     * Handles the form submission for AWB search.
     * @param {Event} e The form submit event.
     */
    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (awb) {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('awb', awb);
            // Update URL without a full page reload
            window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
            fetchTrackingData(awb);
        }
    }, [awb, fetchTrackingData]);

    // Effect to fetch data on initial load if AWB is present in URL
    useEffect(() => {
        if (initialAwb) {
            fetchTrackingData(initialAwb);
        }
    }, [initialAwb, fetchTrackingData]);

    // NEW: disables scroll-snap on this page (needed by the new "snap-section" hero styles)
    useEffect(() => {
        document.documentElement.classList.add('no-snap');
        return () => document.documentElement.classList.remove('no-snap');
    }, []);

    /**
     * Filters and prepares the timeline for display.
     * It ensures unique events per `PROGRESS_STEPS` are shown, using the latest for each.
     */
    const filteredTimelineForDisplay = useMemo(() => {
        if (!trackingData?.timeline) return [];

        // Create a map to store the latest event for each friendly status
        const latestEventPerFriendlyStatus = new Map();

        // Iterate through all events (already sorted chronologically)
        trackingData.timeline.forEach(event => {
            const friendlyStatus = event.friendlyStatus;
            if (PROGRESS_STEPS.includes(friendlyStatus)) { // Only consider events relevant to our progress steps
                const existingEvent = latestEventPerFriendlyStatus.get(friendlyStatus);

                if (!existingEvent) {
                    // If no event for this status yet, add it
                    latestEventPerFriendlyStatus.set(friendlyStatus, event);
                } else {
                    // If an event for this status exists, compare and keep the latest
                    const existingDateTime = new Date(`${existingEvent.date} ${existingEvent.time}`);
                    const currentDateTime = new Date(`${event.date} ${event.time}`);
                    if (currentDateTime > existingDateTime) {
                        latestEventPerFriendlyStatus.set(friendlyStatus, event);
                    }
                }
            }
        });

        // Convert the map values back to an array
        const processedEvents = Array.from(latestEventPerFriendlyStatus.values());

        // Sort these processed events according to the order of PROGRESS_STEPS
        processedEvents.sort((a, b) => {
            const indexA = PROGRESS_STEPS.indexOf(a.friendlyStatus);
            const indexB = PROGRESS_STEPS.indexOf(b.friendlyStatus);
            return indexA - indexB;
        });

        return processedEvents;
    }, [trackingData?.timeline]);


    return (
        <div className="bg-gray-50 min-h-screen">
            {/* ===================== NEW PRE-SEARCH UI (START) ===================== */}
            <SEO path="/tracking" />

            {/* New Hero Section */}
            <section className="relative bg-brand-green text-white py-12 md:py-20 overflow-hidden flex items-center justify-center min-h-[42vh]">
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 inline-block">
                        Home / Tracking
                    </span>
                    <h1 className="font-sora text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Real-Time Shipment Tracking
                    </h1>
                    <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto">
                        Your cargo's journey, visible every step of the way.
                    </p>
                </motion.div>
            </section>

            <section className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
                {/* New AWB Search Form */}
                <motion.form
                    onSubmit={handleSearchSubmit}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    aria-busy={loading}
                    className="flex items-center gap-2 p-2 md:p-3 bg-white/60 backdrop-blur-xl border border-white/50 rounded-full shadow-glass-lg focus-within:border-brand-amber/60 transition-all duration-500 max-w-3xl mx-auto"
                >
                    <Hash className="text-brand-green ml-3 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    <input
                        type="text"
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                        aria-label="AWB or tracking number"
                        aria-describedby="tracking-help"
                        maxLength={80}
                        placeholder="Enter tracking number"
                        required
                        className="bg-transparent outline-none flex-1 text-base md:text-lg text-gray-800 placeholder:text-gray-500 font-medium py-2 min-w-0"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        aria-label="Track shipment"
                        disabled={loading}
                        className="p-3 md:p-4 rounded-full bg-brand-amber text-gray-900 hover:bg-brand-amberDark transition-colors duration-300 shadow-lg disabled:bg-gray-300 flex items-center justify-center flex-shrink-0"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                    </motion.button>
                </motion.form>

                <p id="tracking-help" className="text-sm text-gray-600 text-center mt-4">Use the AWB / tracking number on your booking receipt.</p>

                {/* New Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="status"
                        className="mt-12 flex flex-col items-center justify-center gap-3"
                    >
                        <RefreshCw className="w-8 h-8 md:w-10 md:h-10 animate-spin" style={{ color: COLORS.primary }} />
                        <p className="text-center text-xl font-bold" style={{ color: COLORS.primary }}>Fetching the latest updates...</p>
                    </motion.div>
                )}

                {/* New Error State */}
                {error && (
                    <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 max-w-2xl mx-auto text-red-800">
                        <p>{error}</p>
                        <div className="flex flex-wrap gap-4 mt-3">
                            <button type="button" onClick={() => fetchTrackingData(awb)} className="min-h-11 font-semibold underline">Try again</button>
                            <a href={business.phoneHref} className="min-h-11 inline-flex items-center font-semibold underline">Call for help</a>
                        </div>
                    </div>
                )}

                {/* New Fraud Notice */}
                <div className="beware-notice overflow-hidden relative w-full rounded-full my-8 bg-red-50/60 backdrop-blur-md border border-red-100 text-red-700" tabIndex={0} aria-label="Beware of fraudulent calls or messages. Panchathan Logistics will never ask for personal details or payment outside official channels. Always verify before sharing information.">
                    <div className="beware-track flex w-max py-3 text-sm md:text-base font-semibold" aria-hidden="true">
                        {[0, 1].map(copy => (
                            <span key={copy} className="shrink-0 whitespace-nowrap pr-12">
                                ⚠️ Beware of fraudulent calls or messages! Panchathan Logistics will never ask for your personal details or payment outside official channels. Always verify before sharing information.
                            </span>
                        ))}
                    </div>
                </div>
                {/* ===================== NEW PRE-SEARCH UI (END) ===================== */}

                {/* ===================== RESULTS UI - UNCHANGED (OLD CODE) ===================== */}
                {/* Tracking Data Display */}
                {trackingData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 md:mt-16 bg-white rounded-2xl shadow-3xl p-6 md:p-10 border border-gray-100"
                    >
                        {/* Header: Tracking ID & Current Status */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 md:pb-6 mb-6 md:mb-8 border-b border-gray-100">
                            <div className="flex items-center mb-4 md:mb-0">
                                {React.createElement(getServiceIcon(trackingData.service), {
                                    className: `w-8 h-8 md:w-10 md:h-10 mr-3`,
                                    style: { color: COLORS.primary }
                                })}
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Tracking ID</p>
                                    <div className="flex items-center space-x-2">
                                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                                            {String(trackingData.awb || '').toUpperCase()}
                                        </h2>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleCopyAwb(trackingData.awb)}
                                            className={`p-1 rounded-full transition-colors duration-200 ${copySuccess ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            aria-label="Copy Tracking ID"
                                        >
                                            <Copy className="w-4 h-4 md:w-5 md:h-5" />
                                        </motion.button>
                                        {copySuccess && (
                                            <motion.span
                                                initial={{ opacity: 0, x: 5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -5 }}
                                                className="text-xs font-semibold text-green-600"
                                            >
                                                Copied!
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-full md:w-auto">
                                <span className={`px-3 py-1 md:px-4 md:py-2 text-white font-extrabold rounded-lg text-sm md:text-lg shadow-md ${getStatusColorClass(trackingData.status)} mb-2`}>
                                    {getStatusLabel(trackingData.status)}
                                </span>
                                {/* Display POD button only if podUrl is available and status is DELIVERED */}
                                {trackingData.status === 'DELIVERED' && podUrl && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(podUrl, "_blank")} // Open the decoded POD URL
                                        className="flex items-center gap-2 bg-[#175d29] text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition-all"
                                    >
                                        <Download size={18} />
                                        View POD
                                    </motion.button>
                                )}
                                {/* Show status messages for POD when delivered */}
                                {trackingData.status === 'DELIVERED' && !podUrl && checkingPod && (
                                    <p className="text-sm text-gray-500">Checking for POD...</p>
                                )}
                                {trackingData.status === 'DELIVERED' && !podUrl && !checkingPod && (
                                    <p className="text-sm text-gray-500">POD not available.</p>
                                )}
                            </div>
                        </div>
                        <TrackingProgressBar
                            currentStatus={trackingData.status}
                            progressSteps={PROGRESS_STEPS}
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 text-center my-8 md:my-12">
                            {[
                                { icon: MapPin, label: 'Origin', value: String(trackingData.origin).toUpperCase() },
                                { icon: MapPin, label: 'Destination', value: String(trackingData.destination).toUpperCase() },
                                { icon: Clock, label: 'EDD', value: formatDateOnly(trackingData.estimated_delivery) },
                                { icon: Package, label: 'Service Type', value: trackingData.service },
                                { icon: Package, label: 'No. of Cartons', value: trackingData.carton_count },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                    className="p-3 md:p-4 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center" // Added flex for centering
                                >
                                    {item.isComponent ? ( // Check if the item's value is a React component
                                        <>
                                            {item.icon && <item.icon className={`w-6 h-6 md:w-12 md:h-7 mx-auto mb-2`} style={{ color: COLORS.secondary }} />}
                                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold">{item.label}</p>
                                            {item.value} {/* Render the component directly */}
                                        </>
                                    ) : (
                                        <>
                                            {item.icon && <item.icon className={`w-6 h-6 md:w-12 md:h-7 mx-auto mb-2`} style={{ color: COLORS.secondary }} />}
                                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold">{item.label}</p>
                                            <p className="text-base md:text-lg font-bold text-gray-800 break-words">{item.value}</p>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Shipment History Timeline */}
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 border-b pb-2">Shipment History</h3>
                        <div className="relative">
                            {/* Vertical timeline line */}
                            <div
                                className="absolute left-3 top-0 bottom-0 w-1 rounded-full"
                                style={{ backgroundColor: COLORS.primary }}
                            ></div>

                            {filteredTimelineForDisplay.length > 0 ? (
                                // Reverse to show latest events at the top
                                [...filteredTimelineForDisplay].reverse().map((event, i) => {
                                    const isCurrent = event.friendlyStatus === trackingData.status;

                                    return (
                                        <motion.div
                                            key={`${event.friendlyStatus}-${i}`} // More robust key
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                                            className="mb-6 relative pl-10 md:pl-14"
                                        >
                                            {/* Timeline dot */}
                                            <div
                                                className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center ${getStatusColorClass(event.friendlyStatus)} shadow-lg`}
                                            >
                                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            {/* Event card */}
                                            <div
                                                className={`p-4 rounded-xl transition-all duration-300 border border-gray-200 ${isCurrent
                                                    ? 'bg-indigo-50 shadow-md border-l-4 border-green-800'
                                                    : 'bg-white hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start">
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <p className="text-base md:text-lg font-extrabold text-gray-900 leading-tight">
                                                            {getStatusLabel(event.friendlyStatus)}
                                                        </p>
                                                        <p className="text-sm md:text-md text-gray-700 font-medium mt-1">
                                                            {event.location}
                                                        </p>
                                                        {event.note && (
                                                            <p className="text-xs italic text-gray-500 mt-1 break-words">
                                                                Note: {event.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-left sm:text-right mt-2 sm:mt-0 flex-shrink-0">
                                                        <p
                                                            className={`text-sm font-semibold`}
                                                            style={{ color: COLORS.primary }}
                                                        >
                                                            {event.date}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{event.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-500 pt-4">
                                    No detailed history available yet.
                                </p>
                            )}
                        </div>

                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default Tracking;
