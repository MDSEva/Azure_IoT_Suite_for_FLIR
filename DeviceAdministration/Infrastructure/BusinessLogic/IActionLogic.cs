using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.Azure.Devices.Applications.RemoteMonitoring.DeviceAdmin.Infrastructure.BusinessLogic
{
    public interface IActionLogic
    {
        Task<List<string>> GetAllActionIdsAsync();

        //MDS bae 2017.0626 add imageurl parameter
        Task<bool> ExecuteLogicAppAsync(string actionId, string deviceId, string captureimage, string measurementName, double measuredValue);
    }
}
