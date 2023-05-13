import { Tide } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 潮汐参数模块
 */
// * 获取该坐标的潮汐参数
export const getLngLatTideApi = (params: Tide.ReqTideParams) => {
	return http.get<Tide.ResTideParams>(PORT1 + `/envi_tide_standalone_app/get_tidal_xyz`, params);
};