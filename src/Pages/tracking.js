import React, { useState, useEffect, useMemo, useCallback } from 'react';
import GlassCard from '../Components/ui/GlassCard';
import { useSearchParams } from 'react-router-dom';
import { Hash, Search, Clock, MapPin, Plane, Truck, CheckCircle, Package, Copy, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../Components/SEO';

const COLORS = {
  primary: "#175d29",
  secondary: "#f5a623",
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
      return 'bg-gray-400 text-white border-gray-400';
    default: return 'bg-gray-500 text-white border-gray-500';
  }
};

const getStatusLabel = (status) => {
  if (!status || typeof status !== "string") return "Unknown";
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const getShortStatusLabel = (status) => {
  const s = status ? status.toUpperCase() : '';
  switch (s) {
    case 'BOOKED': return 'Booked';
    case 'PICKED_UP': return 'Picked';
    case 'IN_TRANSIT': return 'In Transit';
    case 'WAREHOUSE_CLEARANCE': return 'W.Clearance';
    case 'OUT_FOR_DELIVERY': return 'O.F.D';
    case 'DELIVERED': return 'Delivered';
    default: return getStatusLabel(status);
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

  if (statusUpper.includes('DELIVERED') || statusUpper.includes('DLY') || statusUpper.includes('DLV') || statusUpper.includes('PROOF_OF_DELIVERY')) {
    return 'DELIVERED';
  }

  if (statusUpper.includes('OUT_FOR_DELIVERY') || statusUpper.includes('OFD') || statusUpper.includes('DO') || statusUpper.includes('DELIVERY_OUT') || statusUpper.includes('DRS')) {
    return 'OUT_FOR_DELIVERY';
  }

  if (statusUpper.includes('CUSTOMS') || statusUpper.includes('CLEARED') || statusUpper.includes('HELD') || statusUpper.includes('WAREHOUSE') || statusUpper.includes('TRANSIT_CLEARANCE')) {
    return 'WAREHOUSE_CLEARANCE';
  }

  if (statusUpper.includes('IN_TRANSIT') || statusUpper.includes('TRN') || statusUpper.includes('DEPARTED') || statusUpper.includes('MOVING') || statusUpper.includes('FORWARDED') || statusUpper.includes('FWD')) {
    return 'IN_TRANSIT';
  }

  if (statusUpper.includes('PICKED_UP') || statusUpper.includes('PU') || statusUpper.includes('RECEIVED') || statusUpper.includes('RCV') || statusUpper.includes('MANIFESTED')) {
    return 'PICKED_UP';
  }

  if (statusUpper.includes('BOOKED') || statusUpper.includes('CREATED') || remarkUpper.includes('CREATED') || locationUpper.includes('BRANCH') || statusUpper.includes('INSERTED')) {
    return 'BOOKED';
  }

  return getStatusLabel(apiStatus || 'UNKNOWN').toUpperCase().replace(/ /g, '_');
};

const TrackingProgressBar = ({ currentStatus, progressSteps }) => {
  if (!progressSteps || progressSteps.length === 0) return null;

  const currentStepIndex = progressSteps.findIndex(step => step === currentStatus);
  const stepsCount = progressSteps.length;

  let progressPercentage = 0;
  if (currentStepIndex >= 0) {
    if (stepsCount > 1) {
      const centerFactor = 1 / (stepsCount - 1.2);
      progressPercentage = (currentStepIndex * centerFactor) * 100;
    } else {
      progressPercentage = 100;
    }
  }

  return (
    <div className="mb-12">
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/50 border border-white/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ backgroundColor: COLORS.primary }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full"
          />
        </div>

        <div className="flex justify-between -mt-7">
          {progressSteps.map((step, index) => {
            const isCurrent = step === currentStatus;
            const isCompleted = index <= currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: isCompleted ? 1 : 0.7 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`w-4 h-4 rounded-full border-2 ${isCompleted ? 'border-white' : 'border-gray-300'
                    } ${isCompleted ? getStatusColorClass(step).split(' ')[0] : 'bg-white'} shadow-md`}
                />
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
    return dateTimeStr.split(' ')[0];
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

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

      if (responseData.status === "failed" || !responseData.data || responseData.data.length === 0) {
        setError("AWB tracking data not found. Please double-check the number.");
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
        shipment_weight: apiResult.total_weight || detail.carton_weight || summary[0]?.carton_weight || 'N/A',
      };

      if (Object.keys(detail).length > 0) {
        const timelineEvents = summary.slice().reverse().map(event => ({
          friendlyStatus: mapApiStatusToFriendlyStatus(event.opr_mode, event.remark, event.src_point),
          status: event.opr_mode,
          date: event.transit_date,
          time: event.transit_time,
          location: event.dest_point,
          note: event.remark || null,
        }));

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
          timeline: timelineEvents,
        };

        if (transformedData.timeline.length > 0) {
          const stepRanks = PROGRESS_STEPS.reduce((acc, step, idx) => {
            acc[step] = idx;
            return acc;
          }, {});

          let maxStepIndex = -1;
          let latestStatus = 'BOOKED';

          transformedData.timeline.forEach(event => {
            const idx = stepRanks[event.friendlyStatus];
            if (idx !== undefined && idx > maxStepIndex) {
              maxStepIndex = idx;
              latestStatus = event.friendlyStatus;
            }
          });

          transformedData.status = latestStatus;
        } else {
          transformedData.status = mapApiStatusToFriendlyStatus(detail.current_status_desc, null, detail.current_location);
        }

        setTrackingData(transformedData);
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
      window.history.pushState(null, '', `/tracking?awb=${awb}`);
      fetchTrackingData(awb);
    }
  };

  useEffect(() => {
    if (initialAwb) {
      fetchTrackingData(initialAwb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAwb]);

  useEffect(() => {
    document.documentElement.classList.add('no-snap');
    return () => document.documentElement.classList.remove('no-snap');
  }, []);

  const getFilteredTimeline = (timeline, service) => {
    if (!timeline || timeline.length === 0) return [];

    const isAir = service && service.toLowerCase().includes("air");

    if (!isAir) {
      return timeline.filter(event => event.friendlyStatus !== 'WAREHOUSE_CLEARANCE');
    }

    return timeline;
  };

  const filteredTimeline = useMemo(() => {
    return trackingData ? getFilteredTimeline(trackingData.timeline, trackingData.service) : [];
  }, [trackingData]);

  return (
    <div>
      <SEO
        title="Track Your Shipment — AWB & Pincode Tracking"
        description="Track your Panchathan Logistics courier or cargo shipment in real time using your AWB number or check pincode serviceability across Chennai, Tamil Nadu and all of India."
        keywords="track courier Chennai, AWB tracking India, cargo tracking Tamil Nadu, pincode serviceability check, Panchathan Logistics tracking"
        path="/tracking"
      />
      <section className="relative bg-brand-green text-white pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden flex items-center justify-center min-h-[42vh]">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
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

      <section className="snap-section py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="flex items-center gap-2 p-2 md:p-3 bg-white/60 backdrop-blur-xl border border-white/50 rounded-full shadow-glass-lg focus-within:border-brand-amber/60 transition-all duration-500 max-w-3xl mx-auto"
        >
          <Hash className="text-brand-green ml-3 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          <input
            type="text"
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            placeholder="Enter AWB or Tracking ID (e.g., PL7865XXXX)"
            required
            className="bg-transparent outline-none flex-1 text-base md:text-lg text-gray-800 placeholder:text-gray-500 font-medium py-2 min-w-0"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
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

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col items-center justify-center gap-3"
          >
            <RefreshCw className="w-8 h-8 md:w-10 md:h-10 animate-spin" style={{ color: COLORS.primary }} />
            <p className="text-center text-xl font-bold" style={{ color: COLORS.primary }}>Fetching the latest updates...</p>
          </motion.div>
        )}
        {error && <p className="mt-12 text-center text-red-600 font-medium p-4 bg-red-50/80 backdrop-blur-md rounded-2xl max-w-xl mx-auto border-l-4 border-red-500">{error}</p>}

        <div className="overflow-hidden relative w-full rounded-full my-8 bg-red-50/60 backdrop-blur-md border border-red-100">
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
          <GlassCard hover={false} className="mt-12 md:mt-16 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 md:pb-6 mb-6 md:mb-8 border-b border-white/40">
              <div className="flex items-center mb-4 md:mb-0">
                {React.createElement(getServiceIcon(trackingData.service), {
                  className: "w-8 h-8 md:w-10 md:h-10 mr-3",
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
                      className={`p-1 rounded-full transition-colors duration-200 ${copySuccess ? 'bg-green-500 text-white' : 'bg-white/60 text-gray-600 hover:bg-white/90'}`}
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
              <div className="text-right w-full md:w-auto">
                <span className={`px-3 py-1 md:px-4 md:py-2 font-extrabold rounded-lg text-sm md:text-lg shadow-md ${getStatusColorClass(trackingData.status)}`}>
                  {getStatusLabel(trackingData.status)}
                </span>
              </div>
            </div>

            <TrackingProgressBar currentStatus={trackingData.status} progressSteps={PROGRESS_STEPS} />

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5 text-center my-8 md:my-12">
              {[
                { icon: MapPin, label: 'Origin', value: String(trackingData.origin || 'N/A').toUpperCase() },
                { icon: MapPin, label: 'Destination', value: String(trackingData.destination || 'N/A').toUpperCase() },
                { icon: Clock, label: 'EDD', value: formatDateOnly(trackingData.estimated_delivery) },
                { icon: Package, label: 'Service Type', value: trackingData.service },
                { icon: Package, label: 'No. of Cartons', value: trackingData.carton_count },
                { icon: Package, label: 'Total WGT. (Kg)', value: `${trackingData.shipment_weight} Kg` },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="p-3 md:p-4 bg-white/50 border border-white/50 rounded-2xl hover:bg-white/70 transition-colors duration-300"
                >
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2" style={{ color: COLORS.secondary }} />
                  <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold">{item.label}</p>
                  <p className="text-base md:text-lg font-bold text-gray-800 break-words">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xl md:text-2xl font-sora font-bold text-gray-900 mb-6 md:mb-8 border-b border-white/40 pb-2">Shipment History</h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: COLORS.primary }} />

              {filteredTimeline.length > 0 ? (
                filteredTimeline.map((event, i) => {
                  const isCurrent = event.friendlyStatus === trackingData.status;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                      className="mb-6 relative pl-10 md:pl-14"
                    >
                      <div className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center ${getStatusColorClass(event.friendlyStatus)} shadow-lg`}>
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <div
                        className={`p-4 rounded-2xl transition-all duration-300 border ${isCurrent
                          ? 'bg-white/80 shadow-md border-brand-green border-l-4'
                          : 'bg-white/40 hover:bg-white/60 border-white/40'
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
                            <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
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
          </GlassCard>
        )}
      </section>
    </div>
  );
};

export default Tracking;
