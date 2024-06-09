import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import TripDataService from '@/services/tripdata';
import dayjs from 'dayjs';

describe('TripDataService', () => {
  let service: TripDataService;

  beforeEach(() => {
    service = new TripDataService();
  });

  it('initializes with normalized conditions to query the data', () => {
    expect(service.normalizedConditions).toEqual([
      { field: 'total_amount', operator: '>', value: 0 },
      { field: 'total_amount', operator: '<', value: 1000 },
      { field: 'tpep_dropoff_datetime - tpep_pickup_datetime', operator: '>', value: 0 },
      { field: 'trip_distance', operator: '>', value: 0 },
      { field: 'passenger_count', operator: '>', value: 0}
    ]);
  });

  it('the normalized query is generated with the expected conditions', () => {
    const query = service.getNormalizedQuery();
    expect(query).toContain('total_amount > 0');
    expect(query).toContain('total_amount < 1000');
    expect(query).toContain('tpep_dropoff_datetime - tpep_pickup_datetime > 0');
    expect(query).toContain('trip_distance > 0');
    expect(query).toContain('passenger_count > 0');
  });

  it('includes date conditions in the query when dates are set', () => {
    service.startDate = dayjs('2017-01-01');
    service.endDate = dayjs('2017-01-31');
    const query = service.getNormalizedQuery();

    console.log(query);
    expect(query).toContain("tpep_pickup_datetime >= '2017-01-01 00:00:00'");
    expect(query).toContain("tpep_pickup_datetime <= '2017-01-31 23:59:59'");
  });

  describe('work with dates', () => {
    const minDate = '2017-01-01';
    const maxDate = '2017-01-31';

    it('should get dates from 1st to 31st january 2017', async () => {
      const mockQueryTripdata = jest.fn().mockResolvedValue([{ min_date: minDate, max_date: maxDate }]);
      service.queryTripdata = mockQueryTripdata;

      const result = await service.getMinMaxDates();

      const expectedQuery = [
        "SELECT min(DATE(tpep_pickup_datetime)) as min_date, max(DATE(tpep_pickup_datetime)) as max_date",
        "FROM _",
        "WHERE " + service.getNormalizedQuery(false)
      ].join(' ');

      expect(mockQueryTripdata).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual({ min_date: '2017-01-01', max_date: '2017-01-31' });
    });
  });
});
