/**
* here is place where can be done visiobas scripts (native javascript with some predefined functions)
* all supported javascript syntax allowed
*
* there are global object (namespace) VB with predefind functions
* global namespace should not be overriden
*
* list of available predefined functions:
*
* read value from server
* VB.Read(string id) -> [number|object|array|string]
* @example let value = VB.Read("L960B17/TRUNK.SUB-24.Parameters.DI_2402.85");
*
* write some value to server
* VB.Write(string id, number|object|array|string value)
* @example VB.Write("L960B17/TRUNK.SUB-24.Parameters.DI_2402.85", 10);
*
*
*/

console.log("executed...");

let Fan1 = VB.Controls("Fan1");

console.log("system status:" + Fan1.systemStatus);
//Fan1.systemStatus();

console.log("system status:" + Fan1.systemStatus);

let value1 = VB.Read("L960B17/TRUNK.SUB-24.Parameters.DI_2402.85");
/*
if (value1 > 50) {
	VB.Fan("Fan1_trans").start();
} else {
	VB.Fan("Fan1_trans").stop();
}
*/
