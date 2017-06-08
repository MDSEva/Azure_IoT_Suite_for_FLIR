using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebJobHost.Startup))]

namespace WebJobHost
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // chris 3:45
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            // Do nothing on startup
        }
    }
}
