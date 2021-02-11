using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FieldsValidation;

namespace SessionAdministration.Controllers
{
    public class ConfigurationController : Controller
    {
        private readonly IConfiguration _configurationService = new ConfigurationService();

        // GET: Configuration
        public ActionResult Index()
        {
            InitConfiguration();
            return View();
        }

        public void InitConfiguration()
        {
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.Init();
        }

        public JsonResult GetTransformations()
        {
            return Json(_configurationService.GetTransformations(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOutputField()
        {
            return Json(_configurationService.GetOutputFields(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFieldValidations(string platformName)
        {
            return Json(_configurationService.GetFieldValidations(platformName), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetValidationRules()
        {
            return Json(_configurationService.GetValidationRules(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOutputFileTypes()
        {
            return Json(_configurationService.GetOutputFileTypes(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void AddFieldValidation(ValidationInsertRequest obj)
        {
            _configurationService.AddFieldValidation(obj);
        }

        public void DeleteFieldValidation(string selectedPlatform, int line)
        {
            _configurationService.DeleteFieldValidation(selectedPlatform, line);
        }

        public JsonResult GetPlatforms()
        {
            return Json(_configurationService.GetPlatforms(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void InsertOutputField(string outputField)
        {
            _configurationService.InsertOutputField(outputField);
        }

        public JsonResult GetAdditionalConfiguration()
        {
            return Json(_configurationService.GetAdditionalConfiguration(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SaveConfiguration(AdditionConfiguration newConfig)
        {
            _configurationService.SaveConfiguration(newConfig);
        }

        public JsonResult GetPlatformInformations()
        {
            return Json(_configurationService.GetPlatformInformations(), JsonRequestBehavior.AllowGet);
        }

        public void DeletePlatformInformation(string index, string platformId, string platformName)
        {
            _configurationService.DeletePlatformInformation( index, platformId, platformName);
        }

        [HttpPost]
        public void AddPlatformInformation(PlatformInfo obj)
        {
            _configurationService.AddPlatformInformation(obj);
        }

        public JsonResult GetFieldParser(string selectedPlatform)
        {
            return Json(_configurationService.GetFieldParser(selectedPlatform), JsonRequestBehavior.AllowGet);
        }

        [ValidateInput(false)]
        public void InsertFileParser(string platform, string parserType, string delimiters, string skipLines)
        {
            _configurationService.InsertFileParser(platform, parserType, delimiters, skipLines);
        }

        public void DeleteFileParser(int index, string platform)
        {
            _configurationService.DeleteFileParser(index, platform);
        }

        public JsonResult GetParserTypes()
        {
            return Json(_configurationService.GetParserTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFieldVersions(string selectedPlatform)
        {
            return Json(_configurationService.GetFieldVersions(selectedPlatform), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMethodVersions(string selectedPlatform, string selectedVersion)
        {
            return Json(_configurationService.GetMethodVersions(), JsonRequestBehavior.AllowGet);
        }

        public void DeleteFieldVersion(int index, string selectedPlatform, string selectedVersion)
        {
            _configurationService.DeleteFieldVersion(index, selectedPlatform, selectedVersion);
        }

        public void InsertFieldVersion(string selectedPlatform, string selectedVersion, string version, string format, string dateFrom, string dateTo)
        {
            _configurationService.InsertFieldVersion(selectedPlatform, selectedVersion, version, format, dateFrom, dateTo);
        }

        public int CheckIfVersionExist(string selectedPlatform, string selectedVersion)
        {
            return _configurationService.CheckIfVersionExist(selectedPlatform, selectedVersion);
        }

        public bool CheckDateOverlap(string selectedPlatform, string selectedVersion, string dateFrom, string dateTo)
        {
            DateTime dateFromParsed = DateTime.Parse(dateFrom);
            DateTime dateToParsed = DateTime.Parse(dateTo);
           
            return _configurationService.CheckDateOverlap(selectedPlatform, selectedVersion, dateFromParsed, dateToParsed);
        }

        public JsonResult GetFieldVersionDetails(string selectedPlatform, string selectedVersion, int index)
        {
            return Json(_configurationService.GetFieldVersionDetails(selectedPlatform, selectedVersion, index), JsonRequestBehavior.AllowGet);
        }

       

        public void InsertVersionDetail(string selectedPlatform, string selectedVersion, int index, string name, string length)
        {
            _configurationService.InsertFieldVersionDetail(selectedPlatform, selectedVersion, index, name, length);   
        }

        public void DeleteFieldVersionDetail(string selectedPlatform, string selectedVersion, int index, int detailIndex)
        {
            _configurationService.DeleteFieldVersionDetail(selectedPlatform, selectedVersion, index, detailIndex);
        }

        public ActionResult FieldVersionDetails()
        {
            return View("~/Views/Configuration/FieldVersionDetails.cshtml");
        }
        public JsonResult GetInputList(string platform, string version)
        {
            return Json(_configurationService.GetInputList(platform, version), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOutputList()
        {
            return Json(_configurationService.GetOutputList(), JsonRequestBehavior.AllowGet);
        }

        public void Map(string platform, string inputField, string transform, string outputField)
        {
            _configurationService.Map(platform, inputField, transform, outputField);
        }

        public JsonResult GetMappings(string platform)
        {
            return Json(_configurationService.GetMappings(platform), JsonRequestBehavior.AllowGet);
        }

        public void DeleteMapping(string platform, int index)
        {
            _configurationService.DeleteMapping(platform, index);
        }
        /* PARTIAL VIEWS */

        public ActionResult GetPartialByName(string partialName)
        {
            return PartialView("~/Views/Configuration/Partials/"+ partialName+ ".cshtml");
        }



        

    }
}