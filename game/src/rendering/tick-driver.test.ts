import { describe, expect, it } from 'vitest';
import type { Ticker } from 'pixi.js';
import { createTickDriver } from './tick-driver';

type TickerListener = Parameters<Ticker['add']>[0];

class FakeTicker {
  private listener: TickerListener | undefined;

  add(listener: TickerListener): this {
    this.listener = listener;
    return this;
  }

  emit(deltaMS: number): void {
    this.listener?.({ deltaMS } as Ticker);
  }
}

function driverFor(ticker: FakeTicker, onTick: (tick: number) => void = () => undefined) {
  return createTickDriver(ticker as unknown as Ticker, 100, onTick);
}

describe('tick driver', () => {
  it('does not advance before start', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));

    ticker.emit(250);

    expect(ticks).toEqual([]);
    expect(driver.running).toBe(false);
  });

  it('accumulates delta across frames and emits at each threshold', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));
    driver.start();

    ticker.emit(40);
    ticker.emit(59);
    expect(ticks).toEqual([]);

    ticker.emit(1);
    expect(ticks).toEqual([1]);

    ticker.emit(99);
    expect(ticks).toEqual([1]);
    ticker.emit(1);
    expect(ticks).toEqual([1, 2]);
  });

  it('produces every tick crossed by one large delta', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));
    driver.start();

    ticker.emit(250);
    expect(ticks).toEqual([1, 2]);

    ticker.emit(50);
    expect(ticks).toEqual([1, 2, 3]);
  });

  it('does not advance while stopped', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));
    driver.start();
    ticker.emit(40);
    driver.stop();

    ticker.emit(200);
    expect(ticks).toEqual([]);

    driver.start();
    ticker.emit(60);
    expect(ticks).toEqual([1]);
  });

  it('advances exactly one tick per manual step without starting the timer', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));

    driver.step();
    driver.step();
    ticker.emit(500);

    expect(ticks).toEqual([1, 2]);
    expect(driver.running).toBe(false);
  });

  it('ignores a manual step while automatic playback is running', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));
    driver.start();

    driver.step();
    expect(ticks).toEqual([]);
  });

  it('stops consuming the same delta after onTick stops the driver', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => {
      ticks.push(tick);
      driver.stop();
    });
    driver.start();

    ticker.emit(350);

    expect(ticks).toEqual([1]);
    expect(driver.running).toBe(false);
  });

  it('reset clears elapsed time and tick number and requires a new start', () => {
    const ticker = new FakeTicker();
    const ticks: number[] = [];
    const driver = driverFor(ticker, (tick) => ticks.push(tick));
    driver.start();
    ticker.emit(150);
    expect(ticks).toEqual([1]);

    driver.reset();
    expect(driver.running).toBe(false);
    ticker.emit(100);
    expect(ticks).toEqual([1]);

    driver.start();
    ticker.emit(99);
    expect(ticks).toEqual([1]);
    ticker.emit(1);
    expect(ticks).toEqual([1, 1]);
  });
});
