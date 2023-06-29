// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

interface TideArrayItem {
	dateStr: string; // 日期字符串
	paramNum: number; // 数值
}

export interface ReqPointLatlng{
	lng:number;
	lat:number;
}

export interface ResPoint{
	lat:number;
	lng:number;
	timesStamp: string[];
	tides: number[];
}

export namespace Tide{
	export interface ReqTideParams{
		lng: number;
		lat: number;
		dateBJ: string;
		intervalMinutes: number;	
	}

	export interface ResTideParams{
		timesStamp: string[];
		tides: number[];
	}
	
}

export namespace MultiTide{
	export interface ReqMultiTideParams{
		pointLatlngListJSON: string;
		dateBJ: string;
		intervalMinutes: number;	
	}

	export interface ResMultiTideParams{
		point_tide_list: ResPoint[];
	}
	
}


