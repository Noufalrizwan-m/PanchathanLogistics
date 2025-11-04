import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageHero from '../Components/pagehero';
import { useSearchParams } from 'react-router-dom';
import { Hash, Search, Clock, MapPin, Plane, Truck, CheckCircle, Package, Download, Clipboard, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = {
    primary: "#175d29",
    secondary: "#f9a825",
};

const PROGRESS_STEPS = ['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'WAREHOUSE_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const getStatusColorClass = (status) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
        case 'DELIVERED': return 'bg-green-600 text-white border-green-600';
        case 'OUT_FOR_DELIVERY': return 'bg-amber-500 text-white border-amber-500';
        case 'IN_TRANSIT':
        case 'WAREHOUSE_CLEARANCE':
            return 'bg-blue-600 text-white border-blue-600';
        case 'PICKED_UP':
            return 'bg-green-700 text-white border-green-700';
        case 'BOOKED':
            return 'bg-green-700 text-white border-green-700';
        default: return 'bg-gray-500 text-white border-gray-500';
    }
};

const getStatusLabel = (status) => {
    if (!status || typeof status !== "string") return "Unknown";
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Returns a short label for small screens.
 */
 
const getShortStatusLabel = (status) => {
    let s = status ? status : ''; // Corrected: Assign status to s first
    s = s.toUpperCase();           // Then call toUpperCase()

    switch (s) {
        case 'BOOKED': return 'Booked';
        case 'PICKED_UP': return 'Picked';
        case 'IN_TRANSIT': return 'In Transit';
        case 'WAREHOUSE_CLEARANCE': return 'W.Clearance';
        case 'OUT_FOR_DELIVERY': return 'O.F.D';
        case 'DELIVERED': return 'Delivered';
        default: return getStatusLabel(s);
    }
};

const getServiceIcon = (service) => {
    if (service && service.toLowerCase().includes("air")) {
        return Plane;
    }
    return Truck;
};

const mapApiStatusToFriendlyStatus = (apiStatus, apiRemark, apiLocation) => {
    const statusUpper = (apiStatus || '').toUpperCase().trim();
    const locationUpper = (apiLocation || '').toUpperCase().trim();
    const remarkUpper = (apiRemark || '').toUpperCase().trim();
    // Prioritize BOOKED as it's the initial state
    // Added 'PENDING' as it often implies a booked but not yet picked up status.
    if (statusUpper.includes('BOOKED') || statusUpper.includes('CREATED') || remarkUpper.includes('CREATED') || locationUpper.includes('BRANCH') || statusUpper.includes('INSERTED') || statusUpper.includes('PENDING')) {
        return 'BOOKED';
    }
    if (statusUpper.includes('PICKED_UP') || statusUpper.includes('PU') || statusUpper.includes('RECEIVED') || statusUpper.includes('RCV') || statusUpper.includes('MANIFESTED')) {
        return 'PICKED_UP';
    }

    if (statusUpper.includes('IN_TRANSIT') || statusUpper.includes('TRN') || statusUpper.includes('DEPARTED') || statusUpper.includes('MOVING') || statusUpper.includes('FORWARDED') || statusUpper.includes('FWD')) {
        return 'IN_TRANSIT';
    }

    // Check for Warehouse Clearance before general in-transit if it's a specific phase
    if (statusUpper.includes('CUSTOMS') || statusUpper.includes('CLEARED') || statusUpper.includes('HELD') || statusUpper.includes('WAREHOUSE') || statusUpper.includes('TRANSIT_CLEARANCE')) {
        return 'WAREHOUSE_CLEARANCE';
    }

    if (statusUpper.includes('OUT_FOR_DELIVERY') || statusUpper.includes('OFD') || statusUpper.includes('DO') || statusUpper.includes('DELIVERY_OUT') || statusUpper.includes('DRS')) {
        return 'OUT_FOR_DELIVERY';
    }

    if (statusUpper.includes('DELIVERED') || statusUpper.includes('DLY') || statusUpper.includes('DLV') || statusUpper.includes('PROOF_OF_DELIVERY')) {
        return 'DELIVERED';
    }

    return getStatusLabel(apiStatus || 'UNKNOWN').toUpperCase().replace(/ /g, '_');
};


// --- Components ---

const TrackingProgressBar = ({ currentStatus, progressSteps }) => {
    if (!progressSteps || progressSteps.length === 0) return null;

    const currentStepIndex = progressSteps.findIndex(step => step === currentStatus);
    const stepsCount = progressSteps.length;

    let progressPercentage = 0;
    if (currentStepIndex >= 0) {
        progressPercentage = (currentStepIndex / (stepsCount - 1)) * 100;
        if (isNaN(progressPercentage)) progressPercentage = 0;
    }

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
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full`}
                    ></motion.div>
                </div>

                {/* Status Dots and Labels - Absolute positioning for precise placement */}
                <div className="absolute w-full top-1 flex justify-between -mt-1">
                    {progressSteps.map((step, index) => {
                        const isCurrent = step === currentStatus;
                        const isCompleted = index <= currentStepIndex;
                        // const isBookedOrDeliveredEndpoint = step === 'BOOKED' || step === 'DELIVERED'; // We will remove this for coloring decisions

                        const leftPosition = (index / (stepsCount - 1)) * 100;
                        if (isNaN(leftPosition)) return null;

                        return (
                            <div
                                key={step}
                                className={`absolute flex flex-col items-center transform -translate-x-1/2`}
                                style={{ left: `${leftPosition}%` }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isCompleted ? 1 : 0.7 }} // Only scale up if completed
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className={`w-4 h-4 rounded-full border-2 shadow-md
                                        ${isCompleted // Only green if completed
                                            ? 'border-white ' + getStatusColorClass(step).split(' ')[0]
                                            : 'border-gray-300 bg-white' // Otherwise, gray border and white background
                                        }
                                    `}
                                >
                                </motion.div>
                                {/* Labels: Adjust top margin to place them below the dot */}
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

const Tracking = () => {
    const [searchParams] = useSearchParams();
    const initialAwb = String(searchParams.get('awb') || searchParams.get('data') || '').trim();
    const [awb, setAwb] = useState(initialAwb);
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [podUrl, setPodUrl] = useState(null);


    const copyTextToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        let textArea;
        try {
            textArea = document.createElement("textarea");
            textArea.value = text;

            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            let successful = document.execCommand('copy');
            if (!successful) {
                throw new Error('Fallback copying unsuccessful');
            }
            return Promise.resolve();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            return Promise.reject(err);
        } finally {
            if (textArea && textArea.parentNode) {
                textArea.parentNode.removeChild(textArea);
            }
        }
    };

    const onCopyAwb = useCallback(async (text) => {
        try {
            await copyTextToClipboard(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, []);

    const formatDateOnly = (dateTimeStr) => {
        if (!dateTimeStr || typeof dateTimeStr !== 'string') return 'N/A';
        const datePart = dateTimeStr.split(' ')[0];
        if (datePart && datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return datePart;
        }
        return 'N/A';
    };

    const fetchTrackingData = async (queryAwb) => {
        const trimmedAwb = String(queryAwb).trim();
        if (!trimmedAwb) {
            setError(null);
            setTrackingData(null);
            return;
        }

        setLoading(true);
        setError(null);
        setTrackingData(null);
        setPodUrl(null); // Reset POD URL on new search

        try {
            const payload = [trimmedAwb];
            const response = await fetch(
                "https://panchathanlogistics.com/billing_php/index.php/multi_tracking_web",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}. Could not reach tracking server.`);
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            if (responseData.status === "failed" || !responseData.data || responseData.data.length === 0) {
                setError(typeof responseData.data === 'string' ? responseData.data : "AWB tracking data not found. Please double-check the number.");
                return;
            }

            const apiResult = responseData.data[0];

            let detail = apiResult.details?.[0] || {};
            const summary = apiResult.summary || [];

            detail = {
                ...detail,
                cnote_no: apiResult.invoice_no || detail.invoice_no,
                current_status_desc: apiResult.current_status || detail.current_status,
                transit_type_name: apiResult.transit_type_name || detail.transit_type_name,
                src_point: apiResult.Origin || detail.Origin || detail.src_point,
                dest_point: apiResult.dest_point || detail.dest_point || 'N/A',
                current_location: apiResult.wh_storage_location_name || detail.wh_storage_location_name || 'N/A',
                expected_delivery_date: apiResult.deliverydate || detail.deliverydate,
                carton_count: apiResult.total_carton || detail.total_box || detail.carton_no || summary[0]?.total_box || summary[0]?.carton_no || 'N/A',
                pod_url: apiResult.pod_link || apiResult.proof_of_delivery_url || detail.pod_link || null,
                // shipment_weight: apiResult.total_weight || detail.carton_weight || summary[0]?.carton_weight || 'N/A',
            };

            if (Object.keys(detail).length > 0) {
                let timelineEvents = summary.map(event => ({
                    friendlyStatus: mapApiStatusToFriendlyStatus(event.opr_mode, event.remark, event.src_point),
                    status: event.opr_mode,
                    date: event.transit_date,
                    time: event.transit_time,
                    location: event.dest_point,
                    note: event.remark || null,
                }));

                const hasBookedEvent = timelineEvents.some(event => event.friendlyStatus === 'BOOKED');
                if (!hasBookedEvent && detail.cnote_no) {
                    const earliestEventDate = timelineEvents.length > 0 ? timelineEvents[0].date : formatDateOnly(new Date().toISOString());
                    const earliestEventTime = timelineEvents.length > 0 ? timelineEvents[0].time : '00:00:00';

                    timelineEvents.unshift({
                        friendlyStatus: 'BOOKED',
                        status: 'BOOKED',
                        date: earliestEventDate,
                        time: earliestEventTime,
                        location: detail.src_point || 'N/A',
                        note: 'Shipment booked and confirmed',
                    });
                }

                timelineEvents.sort((a, b) => {
                    const dateA = new Date(`${a.date || ''} ${a.time || '00:00:00'}`);
                    const dateB = new Date(`${b.date || ''} ${b.time || '00:00:00'}`);

                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;

                    return dateA.getTime() - dateB.getTime();
                });

                const transformedData = {
                    status: 'UNKNOWN',
                    awb: detail.cnote_no || 'N/A',
                    service: detail.transit_type_name || 'N/A',
                    destination: detail.wh_storage_location_name || 'N/A',
                    origin: detail.src_point || 'N/A',
                    current_location: detail.current_location || 'N/A',
                    estimated_delivery: detail.expected_delivery_date || 'N/A',

                    carton_count: detail.carton_count,
                    shipment_weight: detail.shipment_weight,

                    progressSteps: PROGRESS_STEPS,
                    timeline: timelineEvents, // Use the sorted timeline events
                };

                // Determine the latest overall status based on the sorted timeline
                if (transformedData.timeline.length > 0) {
                    const stepRanks = PROGRESS_STEPS.reduce((acc, step, idx) => {
                        acc[step] = idx;
                        return acc;
                    }, {});

                    let maxStepIndex = -1;
                    let latestStatus = 'BOOKED'; // Default to BOOKED if no events or higher status found

                    transformedData.timeline.forEach(event => {
                        const idx = stepRanks[event.friendlyStatus];
                        if (idx !== undefined && idx > maxStepIndex) {
                            maxStepIndex = idx;
                            latestStatus = event.friendlyStatus;
                        }
                    });

                    transformedData.status = latestStatus;
                } else {
                    // Fallback if no timeline events exist, use current status from detail
                    transformedData.status = mapApiStatusToFriendlyStatus(detail.current_status_desc, null, detail.current_location);
                }

                setTrackingData(transformedData);
                // Set POD URL if available and status is DELIVERED
                if (transformedData.status === 'DELIVERED' && detail.pod_url) {
                    setPodUrl(detail.pod_url);
                } else {
                    setPodUrl(null);
                }
            } else {
                setError("AWB tracking data not found or is incomplete.");
            }

        } catch (err) {
            console.error("Tracking API Error:", err);
            setError(
                err.message ||
                "Failed to fetch tracking details due to a network or parsing error."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = (e) => {
        e.preventDefault();
        if (awb) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('awb', awb);
            window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
            fetchTrackingData(awb);
        }
    };

    useEffect(() => {
        if (initialAwb) {
            fetchTrackingData(initialAwb);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialAwb]);


    const getFilteredTimeline = (timeline, service) => {
        if (!timeline || timeline.length === 0) return [];

        const isAir = service && service.toLowerCase().includes("air");

        // If not air cargo, remove WAREHOUSE_CLEARANCE from the timeline display
        if (!isAir) {
            return timeline.filter(event => event.friendlyStatus !== 'WAREHOUSE_CLEARANCE');
        }

        return timeline;
    };

    const filteredTimeline = useMemo(() => {
        // `trackingData.timeline` is already chronologically sorted.
        // `getFilteredTimeline` applies any service-specific filters.
        return trackingData ? getFilteredTimeline(trackingData.timeline, trackingData.service) : [];
    }, [trackingData]);


    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHero
                title="Real-Time Shipment Tracking"
                subtitle="Your cargo's journey, visible every step of the way. Instant, global visibility."
                breadcrumb="Home / Tracking"
            />

            <section className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    className="flex items-center gap-2 p-2 md:p-3 xl:p-4 bg-white rounded-full shadow-2xl border-2 border-transparent focus-within:border-amber-500 transition-all duration-500 max-w-3xl mx-auto"
                >
                    <Hash className="text-gray-400 ml-4 w-6 h-6 flex-shrink-0" />
                    <input
                        type="text"
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                        placeholder="Enter AWB or Tracking ID (e.g., PL7865XXXX)"
                        required
                        className="bg-transparent outline-none flex-1 text-base md:text-lg text-gray-700 placeholder:text-gray-400 font-medium py-2"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="p-3 md:p-4 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-300 shadow-lg disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                            <Search className="w-6 h-6" />
                        )}
                    </motion.button>
                </motion.form>

                {loading && <p className={`mt-12 text-center text-xl font-bold`} style={{ color: COLORS.primary }}>Fetching the latest updates...</p>}
                {error && <p className="mt-12 text-center text-red-600 font-medium p-4 bg-red-50 rounded-xl max-w-xl mx-auto border-l-4 border-red-500">{error}</p>}
                {/* Seamless Fraud Awareness Marquee */}
                <div className="overflow-hidden relative w-full rounded-lg my-8">
                    <motion.div
                        className="flex whitespace-nowrap py-2 font-semibold text-red-600"
                        style={{ display: 'inline-flex' }}
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
                    >
                        <span className="mr-12">
                            ⚠️ Beware of fraudulent calls or messages! Panchathan Logistics will never ask for your personal details or payment outside official channels. Always verify before sharing information.
                        </span>
                        <span className="mr-12">
                            ⚠️ Beware of fraudulent calls or messages! Panchathan Logistics will never ask for your personal details or payment outside official channels. Always verify before sharing information.
                        </span>
                    </motion.div>
                </div>

                {trackingData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 md:mt-16 bg-white rounded-2xl shadow-3xl p-6 md:p-10 border border-gray-100"
                    >
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
                                            onClick={() => onCopyAwb(trackingData.awb)}
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
                                {/* POD Download Button */}
                                {trackingData.status === 'DELIVERED' && podUrl && (
                                    <motion.a
                                        href={podUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-300 text-sm md:text-base mt-2"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download POD
                                    </motion.a>
                                )}
                            </div>
                        </div>

                        <TrackingProgressBar
                            currentStatus={trackingData.status}
                            progressSteps={PROGRESS_STEPS}
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 text-center my-8 md:my-12">
                            {[
                                {
                                    icon: MapPin,
                                    label: 'Origin',
                                    value: String(trackingData.origin || 'N/A').toUpperCase()
                                },
                                {
                                    icon: MapPin,
                                    label: 'Destination',
                                    value: String(trackingData.destination || 'N/A').toUpperCase()
                                },
                                {
                                    icon: Clock,
                                    label: 'EDD',
                                    value: formatDateOnly(trackingData.estimated_delivery)
                                },
                                {
                                    icon: Package,
                                    label: 'Service Type',
                                    value: trackingData.service
                                },
                                {
                                    icon: Package,
                                    label: 'No. of Cartons',
                                    value: trackingData.carton_count
                                },
                                // {
                                //     icon: Package,
                                //     label: 'Total WGT. (Kg)',
                                //     value: `${trackingData.shipment_weight} Kg`
                                // },

                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                    className="p-3 md:p-4 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <item.icon className={`w-6 h-6 md:w-12 md:h-7 mx-auto mb-2`} style={{ color: COLORS.secondary }} />
                                    <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold">{item.label}</p>
                                    <p className="text-base md:text-lg font-bold text-gray-800 break-words">{item.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 border-b pb-2">Shipment History </h3>
                        <div className="relative">
                            <div
                                className="absolute left-3 top-0 bottom-0 w-1 rounded-full"
                                style={{ backgroundColor: COLORS.primary }}
                            ></div>

                            {filteredTimeline.length > 0 ? (
                                // Display timeline in reverse chronological order (latest first)
                                // Create a copy of the array before reversing to avoid mutating the original
                                [...filteredTimeline].map((event, i) => {
                                    const isCurrent = event.friendlyStatus === trackingData.status;

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                                            className="mb-6 relative pl-10 md:pl-14"
                                        >
                                            <div
                                                className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center ${getStatusColorClass(event.friendlyStatus)} shadow-lg`}
                                            >
                                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
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