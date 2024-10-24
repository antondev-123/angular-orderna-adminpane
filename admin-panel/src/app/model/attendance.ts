import { AttendanceDto } from './attendance-response';
import { AttendanceSummary } from './attendance-summary';
import { Break } from './break';
import { Store } from './store';
import { User } from './user';

export class Attendance {
  #id: number;
  #store: Store;
  #user: User;
  #date: Date;
  #clockIn: Date;
  #clockInImage: string;
  #clockOut?: Date;
  #clockOutImage?: string;
  #wagePerHour: number;
  #breaks: Break[];
  #activeBreak?: Date;

  constructor(dto: AttendanceDto) {
    const {
      id,
      store,
      user,
      date,
      clockIn,
      clockOut,
      clockInImage,
      clockOutImage,
      wagePerHour,
      breaks,
      activeBreak,
    } = dto;
    this.#id = id;
    this.#store = store;
    this.#user = user;
    this.#date = date;
    this.#clockIn = clockIn;
    this.#clockInImage = clockInImage;
    this.#clockOut = clockOut;
    this.#clockOutImage = clockOutImage;
    this.#wagePerHour = wagePerHour;
    this.#breaks = breaks.map((b) => new Break(b));
    this.#activeBreak = activeBreak;
  }

  toAttendanceSummary(): AttendanceSummary {
    let totalHours: number | undefined = undefined;

    if (this.#clockOut) {
      totalHours = Math.round(
        (this.#clockOut.getTime() - this.#clockIn.getTime()) / 1000 / 60 / 60
      );
    }

    const breakHours = this.#breaks.reduce(
      (acc, b) => acc + b.getDuration(),
      0
    );

    return {
      id: this.#id,
      userName: `${this.#user.firstName} ${this.#user.lastName}`,
      date: this.#date,
      hourlyPay: this.#wagePerHour,
      breakHours: Math.round(breakHours),
      totalHours,
      totalPay: totalHours ? Math.round((totalHours - breakHours) * this.#wagePerHour) : undefined,
    };
  }

  get id() {
    return this.#id;
  }

  get store() {
    return this.#store;
  }

  set store(store: Store) {
    this.#store = store;
  }

  get clockInImage() {
    return this.#clockInImage;
  }

  set clockInImage(image: string) {
    this.#clockInImage = image;
  }

  set clockOutImage(image: string | undefined) {
    this.#clockOutImage = image;
  }

  get clockOutImage() {
    return this.#clockOutImage;
  }

  get user() {
    return this.#user;
  }

  get date() {
    return this.#date;
  }

  get clockIn() {
    return this.#clockIn;
  }

  get clockOut() {
    return this.#clockOut;
  }

  set clockOut(clockOut: Date | undefined) {
    this.#clockOut = clockOut;
  }

  get wagePerHour() {
    return this.#wagePerHour;
  }

  get breaks() {
    return this.#breaks;
  }

  get activeBreak() {
    return this.#activeBreak;
  }

  set activeBreak(active: Date | undefined) {
    this.#activeBreak = active;
  }
}
