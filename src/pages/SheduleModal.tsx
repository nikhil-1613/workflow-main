import { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, DateSelectArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // local string like "2025-09-26T10:00"
  end?: string;  
  allDay?: boolean;
}

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('');
  const [newEventEnd, setNewEventEnd] = useState('');

  if (!isOpen) return null;

  const openEventModal = (title: string, start: string, end?: string, id?: string) => {
    setNewEventTitle(title);
    setNewEventStart(start);
    setNewEventEnd(end || '');
    setCurrentEventId(id || null);
    setEventModalOpen(true);
  };

  const handleDateClick = (info: any) => {
    openEventModal('', info.dateStr + 'T00:00', '');
  };

  const handleSelect = (info: DateSelectArg) => {
    openEventModal('', info.startStr, info.endStr);
  };

  const handleEventClick = (info: EventClickArg) => {
    const event = info.event;
    openEventModal(
      event.title,
      event.start?.toISOString().slice(0,16) || '',
      event.end?.toISOString().slice(0,16) || '',
      event.id
    );
  };

  const handleSaveEvent = () => {
    if (!newEventTitle || !newEventStart) return;

    const startDate = newEventStart; 
    const endDate = newEventEnd || newEventStart;

    const startDay = new Date(startDate).toDateString();
    const endDay = new Date(endDate).toDateString();

    if (startDay !== endDay) {
      // Multi-day: create daily blocks
      const eventsToAdd: CalendarEvent[] = [];
      let current = new Date(startDate);
      const startTime = newEventStart.slice(11);
      const endTime = newEventEnd ? newEventEnd.slice(11) : startTime;

      while (current <= new Date(endDate)) {
        const dayString = current.toISOString().slice(0,10);
        eventsToAdd.push({
          id: Date.now().toString() + Math.random(),
          title: newEventTitle,
          start: dayString + "T" + startTime,
          end: dayString + "T" + endTime,
          allDay: false,
        });
        current.setDate(current.getDate() + 1);
      }
      setEvents(prev => [...prev, ...eventsToAdd]);
    } else {
      const eventData: CalendarEvent = {
        id: currentEventId || Date.now().toString(),
        title: newEventTitle,
        start: startDate,
        end: endDate,
        allDay: false,
      };
      setEvents(prev => currentEventId
        ? prev.map(ev => ev.id === currentEventId ? eventData : ev)
        : [...prev, eventData]);
    }

    setEventModalOpen(false);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { event } = eventInfo;
    const startTime = event.start ? event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const endTime = event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : startTime;

    return (
      <div className="flex flex-col break-words">
        <div className="font-semibold text-sm md:text-base">{event.title}</div>
        {timeString && <div className="text-xs text-gray-600 dark:text-gray-300">{timeString}</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween' }}
        className="bg-white dark:bg-gray-800 h-full w-full md:w-3/4 lg:w-2/3 shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 md:p-4 border-b dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">My Schedules</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs md:text-sm bg-gray-300 dark:bg-gray-600 rounded-lg"
          >
            Close
          </button>
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-auto p-2 md:p-4 min-h-[500px]">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            select={handleSelect}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            eventContent={renderEventContent}
            height="100%"
            dayMaxEventRows={true} // display multiple events in small screens
            eventDisplay="block"    // force block display
          />
        </div>
      </motion.div>

      {/* Add/Edit Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 overflow-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 p-3 md:p-5 rounded-xl w-full max-w-sm sm:max-w-md shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-800 dark:text-white">Schedule Details</h3>
            
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full mb-2 md:mb-3 p-2 md:p-3 border rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white"
            />

            <label className="block text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-1">Start Date/Time</label>
            <input
              type="datetime-local"
              value={newEventStart}
              onChange={(e) => setNewEventStart(e.target.value)}
              className="w-full mb-2 md:mb-3 p-2 md:p-3 border rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white"
            />

            <label className="block text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-1">End Date/Time (optional)</label>
            <input
              type="datetime-local"
              value={newEventEnd}
              onChange={(e) => setNewEventEnd(e.target.value)}
              className="w-full mb-2 md:mb-3 p-2 md:p-3 border rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white"
            />

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
              <button
                onClick={() => setEventModalOpen(false)}
                className="px-3 py-2 text-sm bg-gray-300 dark:bg-gray-600 rounded-lg w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
