import {PaginationOptions} from '../Interfaces/pagination-options.interface';

export interface GetObservationsOptions extends PaginationOptions {
  populate?: string[];
  onePer?: string; // i.e. 'sensor' or 'timeseries'
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string; // 'asc' or 'desc'
}