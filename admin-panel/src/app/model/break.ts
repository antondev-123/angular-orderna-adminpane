export interface BreakDto {
  id: number;
  attendanceId: number;
  start: Date;
  end: Date;
}

export class Break {
  #id: number;
  #attendanceId: number;
  #start: Date;
  #end: Date;

  constructor(dto: BreakDto) {
    const { id, attendanceId, start, end } = dto;
    this.#id = id;
    this.#attendanceId = attendanceId;
    this.#start = start;
    this.#end = end;
  }

  getDuration(): number {
    return (this.#end.getTime() - this.#start.getTime()) / 1000 / 60 / 60;
  }

  get id() {
    return this.#id;
  }

  get attendanceId() {
    return this.#attendanceId;
  }

  get start() {
    return this.#start;
  }

  get end() {
    return this.#end;
  }
}
