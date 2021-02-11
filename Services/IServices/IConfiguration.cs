using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FieldsValidation;

namespace SessionAdministration.Services.IServices
{
    interface IConfiguration
    {
        List<string> GetTransformations();
        List<string> GetOutputFields();
        List<string> GetOutputFileTypes();
        List<FileValidation> GetFieldValidations(string selectedPlatform);
        List<string> GetValidationRules();
        void AddFieldValidation(ValidationInsertRequest obj);
        void DeleteFieldValidation(string selectedPlatform, int line);
        List<string> GetPlatforms();
        void InsertOutputField(string outputField);
        AdditionConfiguration GetAdditionalConfiguration();
        void SaveConfiguration(AdditionConfiguration newConfig);
        List<PlatformInfo> GetPlatformInformations();
        void DeletePlatformInformation(string index, string platformId, string platformName);
        void AddPlatformInformation(PlatformInfo obj);
        List<FileParse> GetFieldParser(string selectedPlatform);
        void InsertFileParser(string platform, string parserType, string delimiters, string skipLines);
        void DeleteFileParser(int index, string platform);
        List<string> GetParserTypes();
        List<FieldVersion> GetFieldVersions(string selectedPlatform);
        List<string> GetMethodVersions();
        void DeleteFieldVersion(int index, string selectedPlatform, string selectedVersion);
        void InsertFieldVersion(string selectedPlatform, string selectedVersion, string version, string format, string dateFrom, string dateTo);
        int CheckIfVersionExist(string selectedPlatform, string selectedVersion);
        bool CheckDateOverlap(string selectedPlatform, string selectedVersion, DateTime dateFrom, DateTime dateTo);
        List<FieldVersionDetail> GetFieldVersionDetails(string selectedPlatform, string selectedVersion, int index);
        void InsertFieldVersionDetail(string selectedPlatform, string selectedVersion, int index, string name, string length);
        void DeleteFieldVersionDetail(string selectedPlatform, string selectedVersion, int index, int detailIndex);
        List<string> GetInputList(string platform, string version);
        List<string> GetOutputList();
        void Map(string platform, string inputField, string transform, string outputField);
        List<MappingGetReq> GetMappings(string platform);
        void DeleteMapping(string platform, int index);
    }
}