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

export namespace Tide{
	export interface ReqTideParams{
		lng: number;
		lat: number;	
	}

	export interface ResTideParams{
		timesStamp: string[];
		tides: number[];
	}
	
}



