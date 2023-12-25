import apiClient from '../apiClient';

import { CommonResponse } from './type';

export interface GoodsSpuListReq {
  pageNum: number;
  pageSize: number;
}

export enum GoodsApi {
  GoodsSpuList = '/goods/spus',
}

const fetchGoodsList = (data: GoodsSpuListReq) =>
  apiClient.post<CommonResponse>({ url: GoodsApi.GoodsSpuList, data });

export default {
  fetchGoodsList,
};
