import { Tide, MultiTide } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 获取单点位潮汐数据
 */
export const getLngLatTideApi = (params: Tide.ReqTideParams) => {
	return http.get<Tide.ResTideParams>(PORT1 + `/envi_tide_standalone_app/get_tidal_xyz`, params);
};

/**
 * @name 获取多个点位潮汐数据
 */
// * 获取该坐标的潮汐参数
export const getMultiTideApi = (params: MultiTide.ReqMultiTideParams) => {
	return http.get<MultiTide.ResMultiTideParams>(PORT1 + `/envi_tide_standalone_app/get_multi_tidal`, params);
};