using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SessionAdministration.Controllers
{
    public class SuspendedDetailsController : Controller
    {
        ISuspendedDetails _service = new SuspendedDetailsService();
        // GET: SuspendedDetails
        public ActionResult Index(int sessionId)
        {
            return View(_service.GetSuspendedFileInfo(sessionId));
        }

        public JsonResult GetCDRsBySessionId(int sessionId)
        {
            return Json(_service.GetCDRsBySessionId(sessionId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProcessedCDRsBySessionId(int sessionId)
        {
            return Json(_service.GetProcessedCDRsBySessionId(sessionId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetErrorFieldsOfSuspendedCDR(int cdrId)
        {   
            //shows all suspended fields as info, cant edit
            return Json(_service.GetErrorFieldsOfSuspendedCDR(cdrId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllFieldsOfSuspendedCDR(int cdrId)
        {   //gets all fields to edit 
            return Json(_service.GetAllFieldsOfSuspendedCDR(cdrId), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public void UpdateCDRFields(List<CDRFieldUpdateRequest> cdrList)
        {
            _service.UpdateCDRFields(cdrList);
        }

        public void UpdateCdrStatusError(int cdrId, int status)
        {
            _service.UpdateCdrStatusError(cdrId, status, System.Web.HttpContext.Current.User.Identity.Name, DateTime.Now);
        }
    }
}