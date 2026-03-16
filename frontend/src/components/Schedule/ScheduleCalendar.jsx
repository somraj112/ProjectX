import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const ScheduleCalendar = ({ events, view = 'timeGridWeek' }) => {
  
  // Define custom styles for events based on type
  const eventDidMount = (info) => {
    // If we had a type in the event object, we could use it here.
    // For now assuming colors are passed in the event object or we default.
    // The requirement says: Personal (blue), College (orange).
    // This logic might need to be adjusted based on exact API response shape.
    
    // Applying basic rounded styles
    info.el.style.borderRadius = '4px';
    info.el.style.border = 'none';
    info.el.style.padding = '2px';
  };

  return (
    <div className="schedule-calendar-wrapper h-[calc(100vh-200px)] min-h-[500px] bg-white rounded-xl shadow-sm p-4">
      <style>{`
        .fc {
            font-family: inherit;
        }
        .fc-toolbar-title {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
        }
        .fc-button-primary {
            background-color: #4F46E5 !important;
            border-color: #4F46E5 !important;
            box-shadow: none !important;
        }
        .fc-button-primary:hover {
            background-color: #4338CA !important;
            border-color: #4338CA !important;
        }
        .fc-button-active {
            background-color: #3730A3 !important;
            border-color: #3730A3 !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
            border-color: #E5E7EB;
        }
        .fc-col-header-cell-cushion {
            padding-top: 8px;
            padding-bottom: 8px;
            color: #374151;
        }
        .fc-timegrid-slot-label-cushion {
          color: #6B7280;
        }
        .fc-event {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events} // Pass events directly
        editable={false}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="100%"
        eventDidMount={eventDidMount}
        // Custom event content could go here if we want more detail
      />
    </div>
  );
};

export default ScheduleCalendar;
