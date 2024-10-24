export type Time = string; // Format: hh:mm in military time

export type TimePeriod = {
  opens: Time;
  closes: Time; // If the value for the closes property is less than the value for the opens property then the hour range is assumed to span over the next day.
};
