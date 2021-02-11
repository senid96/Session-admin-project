using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.DAL;
using FORIS.Interbilling.NTS.Mediation.DataStructures;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Xml;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.CheckInput;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FieldsValidation;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FileColumns;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FileColumns.FileTypeVersion.Version;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.ParserConfiguration;
using static FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes;

namespace SessionAdministration.Services
{
    public class ConfigurationService : IConfiguration
    {
        /* Field validations */
        public List<FileValidation> GetFieldValidations(string selectedPlatform)
        {
            FileControl filectr = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileControl>();
            List<FileValidation> list = new List<FileValidation>();
            foreach (var item in filectr.FieldsValidations.Find(p => p.FileType == selectedPlatform).Validations)
            {
                FileValidation fileVal = new FileValidation();
                fileVal.InputField = item.InputField;
                fileVal.ValidationRule = item.ValidationRule.ToString();
                fileVal.DateFrom = item.DateFrom;
                fileVal.DateTo = item.DateTo;
                foreach (var it in item.FieldValues)
                {
                    //TODO
                    fileVal.ValidationValues += it.ToString() + ";";

                }
                fileVal.OutputFileType = item.OutputFileType.ToString();
                list.Add(fileVal);
            }
            return list;
        }

        public List<string> GetValidationRules()
        {
            List<string> validationRules = new List<string>();
            foreach (int value in Enum.GetValues(typeof(ValidationRule)))
            {
                var name = Enum.GetName(typeof(ValidationRule), value);
                validationRules.Add(name);
            }
            return validationRules;
        }

        public List<string> GetOutputFileTypes()
        {
            List<string> outputFileTypes = new List<string>();
            foreach (int value in Enum.GetValues(typeof(OutputFileType)))
            {
                var name = Enum.GetName(typeof(OutputFileType), value);
                outputFileTypes.Add(name);
            }

            return outputFileTypes;
        }

        public void AddFieldValidation(ValidationInsertRequest obj)
        {
            FileControl filectr = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileControl>();
            bool exist = filectr.FieldsValidations.Exists(p => p.FileType == obj.Platform);
            List<Validation> validations = new List<Validation>();
            if (exist)
            {
                validations = filectr.FieldsValidations.Find(p => p.FileType == obj.Platform).Validations;
            }

            Validation validation = new Validation();

            //TextBox txtInputField = gvFileControl.FooterRow.FindControl("TextBox1") as TextBox;
            //DropDownList ddlValidationRule = (DropDownList)gvFileControl.FooterRow.FindControl("DropDownList2");
            //TextBox txtDateFrom = gvFileControl.FooterRow.FindControl("TextBox3") as TextBox;
            //TextBox txtDateTo = gvFileControl.FooterRow.FindControl("TextBox4") as TextBox;
            //TextBox txtValues = gvFileControl.FooterRow.FindControl("TextBox5") as TextBox;
            //DropDownList ddlOutputFileType = (DropDownList)gvFileControl.FooterRow.FindControl("DropDownList6");

            validation.InputField = obj.InputField;
            validation.DateFrom = obj.DateFrom;
            validation.DateTo = obj.DateTo;
            validation.ValidationRule = (ValidationRule)Enum.Parse(typeof(ValidationRule), obj.ValidationRule.ToString());
            validation.OutputFileType = (OutputFileType)Enum.Parse(typeof(OutputFileType), obj.OutputFileType.ToString());

            string normValues = obj.FieldValues;
            if (obj.FieldValues.ToString() != "")
            {
                List<string> listVal = new List<string>();

                if (normValues.Substring(normValues.Length - 1, 1) == ";")
                {
                    normValues = normValues.Remove(normValues.Length - 1);
                }
                string[] val = normValues.Split(';');
                for (int i = 0; i < val.Length; i++)
                {
                    listVal.Add(val[i]);
                }
                validation.FieldValues = listVal;
            }
            validations.Add(validation);
            if (!exist)
            {
                List<FieldsValidation> list = filectr.FieldsValidations;
                FieldsValidation fieldsValidation = new FieldsValidation();
                fieldsValidation.Validations = validations;
                fieldsValidation.FileType = obj.OutputFileType.ToString();
                list.Add(fieldsValidation);
            }

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(filectr.GetType(), filectr);
        }

        public void DeleteFieldValidation(string selectedPlatform, int line)
        {
            FileControl filectr = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileControl>();
            var fieldsValidation = filectr.FieldsValidations.Find(p => p.FileType == selectedPlatform);
            var validations = filectr.FieldsValidations.Find(p => p.FileType == selectedPlatform).Validations;


            if (validations.Count == 1)
            {
                filectr.FieldsValidations.Remove(fieldsValidation);
            }
            else
            {
                validations.RemoveAt(line); //todo
            }


            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(filectr.GetType(), filectr);
        }

        public List<string> GetOutputFields()
        {
            OutputFields of = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<OutputFields>();
            var output = of.OutputFieldsList;

            return output;
        }

        public List<string> GetTransformations()
        {
            List<string> transformationList = new List<string>();

            foreach (int value in Enum.GetValues(typeof(TransformationFunctions)))
            {
                var name = Enum.GetName(typeof(TransformationFunctions), value);
                transformationList.Add(name);
            }
            return transformationList;
        }

        public List<string> GetPlatforms()
        {
            var fileType = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes>();
            List<string> fileTypes = new List<string>();
            foreach (FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes.FileType ft in fileType.FileTypesList)
            {
                if (fileType != null)
                {
                    fileTypes.Add(ft.FileTypeName.ToString());
                }

            }
            return fileTypes;
        }

        public void InsertOutputField(string outputField)
        {
            OutputFields of = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<OutputFields>();
            of.OutputFieldsList.Add(outputField);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(of.GetType(), of);
        }

        public AdditionConfiguration GetAdditionalConfiguration()
        {
            MediationServiceConfiguration ms = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            MedOutputFilesConfiguration mo = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MedOutputFilesConfiguration>();

            var tarifDir = mo.TarificationFile;
            var errorDir = mo.ErrorFile;
            var rejDir = mo.RejectedFile;

            AdditionConfiguration obj = new AdditionConfiguration()
            {
                StartupTimeout = ms.StartupTimeout.ToString(),
                StartTransfer = ms.StartTransfer.ToString(),
                FileCreatedTimeout = ms.FileCreatedTimeout.ToString(),
                NumberOfThreads = ms.NumberOfThreads.ToString(),
                ProcessedDirectory = ms.ProcessedDirectory.ToString(),
                TarificationDirectory = ms.TarificationDirectory.ToString(),
                TariffDirectory = tarifDir.Directory.ToString(),
                TariffExtension = tarifDir.Extension.ToString(),
                RejDirectory = rejDir.Directory.ToString(),
                RejExtension = rejDir.Extension.ToString(),
                ErrDirectory = errorDir.Directory.ToString(),
                ErrExtension = errorDir.Extension.ToString()
            };

            return obj;
        }

        public void SaveConfiguration(AdditionConfiguration newConfig)
        {
            MediationServiceConfiguration ms = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            MedOutputFilesConfiguration mo = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MedOutputFilesConfiguration>();
            var tarifDir = mo.TarificationFile;
            var errorDir = mo.ErrorFile;
            var rejDir = mo.RejectedFile;

            ms.StartupTimeout = int.Parse(newConfig.StartupTimeout);
            ms.StartTransfer = int.Parse(newConfig.StartTransfer);
            ms.FileCreatedTimeout = int.Parse(newConfig.FileCreatedTimeout);
            ms.NumberOfThreads = int.Parse(newConfig.NumberOfThreads);
            ms.ProcessedDirectory = newConfig.ProcessedDirectory;
            ms.TarificationDirectory = newConfig.TarificationDirectory;

            tarifDir.Directory = newConfig.TariffDirectory;
            tarifDir.Extension = newConfig.TariffExtension;
            rejDir.Directory = newConfig.RejDirectory;
            rejDir.Extension = newConfig.RejExtension;
            errorDir.Directory = newConfig.ErrDirectory;
            errorDir.Extension = newConfig.ErrExtension;

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(mo.GetType(), mo);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ms.GetType(), ms);

            string logString = "MediationOutputConfiguration and MediationServiceConfiguration has been changed";
            WriteLog("INSERT", "MED Configuration", "MedOutputConfiguration", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
        }

        public void WriteLog(string eventName, string title, string fileName, string username, string content, string description)
        {
            try
            {
                NtsMed.InsertLogChange(eventName, title, fileName, username, content, description);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

        public List<PlatformInfo> GetPlatformInformations()
        {
            FileTypes ft = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileTypes>();
            MediationServiceConfiguration ms = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            CheckInput ci = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<CheckInput>();
            var dir = ms.InputDirectories;
            var dir2 = ms.ArchiveDirectories;

            DataTable dtFileTypes = new DataTable();
            dtFileTypes.Columns.Add("FileTypeID");
            dtFileTypes.Columns.Add("FileTypeName");
            dtFileTypes.Columns.Add("Directory");
            dtFileTypes.Columns.Add("FileFilter");
            dtFileTypes.Columns.Add("DirectoryIzlazni");
            dtFileTypes.Columns.Add("DirectoryIzvorni");
            dtFileTypes.Columns.Add("IP");
            dtFileTypes.Columns.Add("Port");
            dtFileTypes.Columns.Add("Username");
            dtFileTypes.Columns.Add("Password");
            dtFileTypes.Columns.Add("TimeSpan");

            var fileTypeList = ft.FileTypesList;

            List<PlatformInfo> list = new List<PlatformInfo>(); //

            foreach (var fileType in fileTypeList)
            {
                PlatformInfo obj = new PlatformInfo();
                obj.PlatformId = fileType.FileTypeID;
                obj.Platform = fileType.FileTypeName;

                if (ci.Fajlovi.Exists(p => p.FileType == fileType.FileTypeName))
                {
                    obj.IncomingInterval = ci.Fajlovi.Find(p => p.FileType == fileType.FileTypeName).TimeSpan;
                }


                foreach (var d in dir)
                {
                    if (d.FileType == fileType.FileTypeName)
                    {
                        obj.InputFilePath = d.Directory;
                        obj.InputFileFormat = d.FileFilter;
                    }
                }
                foreach (var d2 in dir2)
                {
                    if (d2.FileType == fileType.FileTypeName)
                    {
                        obj.OutputFileDirectory = d2.DirectoryIzlazni;

                        obj.OriginFileDirectory = d2.DirectoryIzvorni;
                        obj.FTPServer = d2.IP;
                        obj.Port = d2.Port;
                        obj.Username = d2.Username;
                        obj.Password = d2.Password;
                    }
                }

                list.Add(obj);
            }
            return list;
        }

        public void DeletePlatformInformation(string index, string platformId, string platformName)
        {
            FileTypes ft = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileTypes>();
            MediationServiceConfiguration ms = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            CheckInput ci = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<CheckInput>();
            var fileTypeList = ft.FileTypesList;
            var inputDir = ms.InputDirectories;
            var arhDir = ms.ArchiveDirectories;
            var files = ci.Fajlovi;

            string fileTypeID = platformId;
            string fileTypeName = platformName;
            var delFile = files.Find(p => p.FileType == fileTypeName);


            inputDir = inputDir.Where(p => p.FileType != fileTypeName).ToArray();
            arhDir = arhDir.Where(p => p.FileType != fileTypeName).ToArray();
            fileTypeList.RemoveAt(Convert.ToInt32(index));
            files.Remove(delFile);
            ms.InputDirectories = inputDir;
            ms.ArchiveDirectories = arhDir;

            string logString = "FileTypeID: " + fileTypeID + "|" +
                               "FileTypeName: " + fileTypeName;

            WriteLog("DELETE", "MED Configuration", "FileTypes", WindowsIdentity.GetCurrent().Name, logString, "");

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ft.GetType(), ft);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ms.GetType(), ms);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ci.GetType(), ci);
            try
            {
                NtsMed.DeleteFileSource(int.Parse(fileTypeID), fileTypeName);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

        public void AddPlatformInformation(PlatformInfo obj)
        {
            FileTypes ft = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileTypes>();
            MediationServiceConfiguration ms = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            CheckInput ci = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<CheckInput>();

            FileType newFileType = new FileType();
            MedDirectory medIz = new MedDirectory();
            MedDirectory medArh = new MedDirectory();
            Fajl fajl = new Fajl();
            //TODO PORT I INTERVAL MORAJU BITI INT
            var inputDir = ms.InputDirectories;
            var arhiveDir = ms.ArchiveDirectories;
            var files = ci.Fajlovi;

            newFileType.FileTypeID = obj.PlatformId;
            newFileType.FileTypeName = obj.Platform;
            medIz.Directory = obj.InputFilePath;
            medIz.FileFilter = obj.InputFileFormat;
            medIz.FileType = obj.Platform;

            medArh.DirectoryIzlazni = obj.OutputFileDirectory;
            medArh.DirectoryIzvorni = obj.OriginFileDirectory;
            medArh.IP = obj.FTPServer;
            medArh.Port = obj.Port;
            medArh.Username = obj.Username;
            medArh.Password = obj.Password;
            medArh.FileType = obj.Platform;

            fajl.FileType = obj.Platform;
            fajl.TimeSpan = obj.IncomingInterval;

            ft.FileTypesList.Add(newFileType);

            Array.Resize(ref inputDir, inputDir.Length + 1);
            inputDir[inputDir.Length - 1] = medIz;
            Array.Resize(ref arhiveDir, arhiveDir.Length + 1);
            arhiveDir[arhiveDir.Length - 1] = medArh;
            files.Add(fajl);
            ms.InputDirectories = inputDir;
            ms.ArchiveDirectories = arhiveDir;


            string logString = "FileTypeID: " + newFileType.FileTypeID + "|" +
                               "FileTypeName: " + newFileType.FileTypeName + "|" +
                               "Directory:" + medIz.Directory + "|" +
                               "FileFilter:" + medIz.FileFilter + "|" +
                               "DirectoryIzlazni:" + medArh.DirectoryIzlazni + "|" +
                               "DirectoryIzvorni: " + medArh.DirectoryIzvorni + "|" +
                               "IP:" + medArh.IP + "|" +
                               "Port:" + medArh.Port + "|" +
                               "Username:" + medArh.Username + "|" +
                               "Password: " + medArh.Password + "|" +
                               "TimeSpan: " + fajl.TimeSpan;
            WriteLog("INSERT", "MED Configuration", "FileTypes", WindowsIdentity.GetCurrent().Name, logString, "");

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ft.GetType(), ft);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ft.GetType(), ms);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(ft.GetType(), ci);

            try
            {
                NtsMed.InsertFileSource(int.Parse(newFileType.FileTypeID), newFileType.FileTypeName);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

        /* FieldParser */
        public List<FileParse> GetFieldParser(string selectedPlatform)
        {
            ParserConfiguration par = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<ParserConfiguration>();

            DataTable dtParserConfig = new DataTable();
            dtParserConfig.Columns.Add("ParserType");
            dtParserConfig.Columns.Add("SkipLines");
            dtParserConfig.Columns.Add("Delimiters");

            bool exist = par.Platforms.Exists(p => p.FileType == selectedPlatform);

            List<FileParse> list = new List<FileParse>();
            
                PlatformParser parser = par.Platforms.Find(p => p.FileType == selectedPlatform);

                FileParse obj = new FileParse();
                obj.FileType = parser.ParserType.ToString();
                obj.SkipLines = parser.SkipLines;
                if (parser.Delimiters != null)
                {
                    obj.Delimiters = parser.Delimiters.ToString();
                    string allValues = null;
                    foreach (var value in parser.Delimiters)
                    {
                        allValues += value + " ";
                    }
                    obj.Delimiters = allValues;
                }
                list.Add(obj);

            return list;
        }

        public void InsertFileParser(string platform, string parserType, string delimiters, string skipLines)
        {
            ParserConfiguration parser = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<ParserConfiguration>();
            List<PlatformParser> listParser = parser.Platforms;

            ParserTypes parserT = (ParserTypes)Enum.Parse(typeof(ParserTypes), parserType);

            //TODO VALIDACIJA SVA POLJA OBAVEZNA


            PlatformParser par = new PlatformParser();

            par.FileType = platform;
            par.ParserType = parserT;

            string normValues = delimiters;

            par.SkipLines = int.Parse(skipLines);


            if (delimiters != "")
            {

                if (normValues.Substring(normValues.Length - 1, 1) == " ")
                {
                    normValues = normValues.Remove(normValues.Length - 1);
                }
                string[] val = normValues.Split(' ');
                par.Delimiters = val;
            }


            listParser.Add(par);

            string logString = "FileType:" + platform + "|" +
                                  "ParserType:" + parserT + "|" +
                                  "Delimiters:" + normValues + "|" +
                                  "SkipLines:" + par.SkipLines;

            WriteLog("INSERT", "MED Configuration", "ParserConfiguration", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(parser.GetType(), parser);
        }

        public void DeleteFileParser(int index, string platform)
        {
            ParserConfiguration parser = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<ParserConfiguration>();
            var parserList = parser.Platforms;

            string logString = "FileType:" + platform + "|" +
                               "ParserType:" + parserList[index].ParserType.ToString();

        WriteLog("DELETE", "MED Configuration", "ParserConfiguration", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");

        parserList.Remove(parser.Platforms.Find(p=>p.FileType==platform));

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(parser.GetType(), parser);
        }

        public List<string> GetParserTypes()
        {
            List<string> parserTypes = new List<string>();

            foreach (int value in Enum.GetValues(typeof(ParserTypes)))
            {
                var name = Enum.GetName(typeof(ParserTypes), value);
                parserTypes.Add(name);
            }
            return parserTypes;
        }

        /* Field versions */
        public List<FieldVersion> GetFieldVersions(string selectedPlatform)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();

            string selectedFileType = selectedPlatform;
            List<FieldVersion> list = new List<FieldVersion>();

            if (fc.Files.Exists(p => p.fileType == selectedFileType))
            {
                var versionsList = fc.Files.Find(p => p.fileType == selectedFileType).Versions;
                var version = versionsList.FindAll(p => p.VersionName != "");
                
                foreach (var v in versionsList)
                {
                    FieldVersion obj = new FieldVersion(); //
                    obj.Version = v.VersionName;
                    obj.Format = v.VersionFileNameFormat;
                    obj.DateFrom = v.VersionStartDate;
                    obj.DateTo = v.VersionEndDate;

                    list.Add(obj);
                }
            }
            return list;
        }

        public List<string> GetMethodVersions()
        {
            List<string> methods = new List<string>();
            foreach (int value in Enum.GetValues(typeof(VersionDeterminationMethods)))
            {
                var name = Enum.GetName(typeof(VersionDeterminationMethods), value);
                methods.Add(name);
            }
            return methods;
        }

        public void DeleteFieldVersion(int index, string selectedPlatform, string selectedVersion)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();
            string selectedFileType = selectedPlatform;
            VersionDeterminationMethods valueMethod = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);

            var versions = fc.Files.Find(p => p.Method == valueMethod && p.fileType == selectedFileType).Versions;
            var file = fc.Files.Find(p => p.Method == valueMethod && p.fileType == selectedFileType && p.Versions == versions);

            string logString = "FileType:" + selectedPlatform + "|" +
                              "VersionMethod:" + selectedVersion + "|" +
                              "VersionName:" + versions[index].VersionName + "|" +
                              "VersionFileNameFormat:" + versions[index].VersionFileNameFormat + "|" +
                              "VersionStartDate:" + versions[index].VersionStartDate + "|" +
                              "VersionEndDate:" + versions[index].VersionEndDate;
            WriteLog("DELETE", "MED Configuration", "FileControl.Version", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
            
            fc.Files.Remove(file);

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(fc.GetType(), fc);
        }

        public void InsertFieldVersion(string selectedPlatform, string selectedVersion, string version, string format, string dateFrom, string dateTo)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();

            
                var fileType = selectedPlatform;
                var method = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);
                List<FileTypeVersion.Version> versionList = new List<FileTypeVersion.Version>();
                bool exist = fc.Files.Exists(p => p.fileType == fileType && p.Method == method);
                bool fileTypeHasMethod = fc.Files.Exists(p => p.fileType == fileType && p.Method != method);
               
                if (exist)
                {
                    versionList = fc.Files.Find(p => p.fileType == fileType && p.Method == method).Versions;
                }
                else
                {
                    versionList = new List<FileTypeVersion.Version>();
                }
                FileTypeVersion.Version v = new FileTypeVersion.Version();
                v.VersionName = version;
                v.VersionStartDate = dateFrom;
                v.VersionEndDate = dateTo;
                v.VersionFileNameFormat = format;
                versionList.Add(v);
                if (!exist)
                {
                    FileTypeVersion newFileTypeVersion = new FileTypeVersion();
                    newFileTypeVersion.fileType = fileType;
                    newFileTypeVersion.Method = method;
                    newFileTypeVersion.Versions = versionList;
                    fc.Files.Add(newFileTypeVersion);

                }
                string logString = "FileType:" + fileType + "|" +
                  "VersionMethod:" + method + "|" +
                  "VersionName:" + v.VersionName + "|" +
                  "VersionStartDate:" + v.VersionStartDate + "|" +
                  "VersionEndDate:" + v.VersionEndDate + "|" +
                  "VersionFileNameFormat:" + v.VersionFileNameFormat + "|";
             //   WriteLog("INSERT", "MED Configuration", "FileColumns.Version", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
                FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(fc.GetType(), fc);
        }

        // da li postoji druga verzija definisana pored selektovane za unos
        public int CheckIfVersionExist(string selectedPlatform, string selectedVersion)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();

            var fileType = selectedPlatform;
            var method = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);
            List<FileTypeVersion.Version> versionList = new List<FileTypeVersion.Version>();

            bool exist = fc.Files.Exists(p => p.fileType == fileType && p.Method == method);
            bool fileTypeHasMethod = fc.Files.Exists(p => p.fileType == fileType && p.Method != method);
            
            if (fileTypeHasMethod == true)
                return 1; //file has different method defined
            if (exist == true)
                return 2; //file has the same method defined

            return 0; //method is not defined
        }

        public bool CheckDateOverlap(string selectedPlatform, string selectedVersion, DateTime dateFrom, DateTime dateTo)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();

            var fileType = selectedPlatform;
            var method = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);
            List<FileTypeVersion.Version> versionList = new List<FileTypeVersion.Version>();
            bool exist = fc.Files.Exists(p => p.fileType == fileType && p.Method == method);
            
            if (exist)
            {
                versionList = fc.Files.Find(p => p.fileType == fileType && p.Method == method).Versions;

                if (!IsDateValid(dateFrom, dateTo, versionList))
                {
                    return false; //Došlo je do preklapanja intervala!
                }
            }
            return true;
        }

        public List<FieldVersionDetail> GetFieldVersionDetails(string selectedPlatform, string selectedVersion, int index)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();
            string selectedFileType = selectedPlatform;

            DataTable dtFileColumns = new DataTable();
            dtFileColumns.Columns.Add("ColumnName");
            dtFileColumns.Columns.Add("ColumnLength");

            VersionDeterminationMethods valueMethod = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);

            List<FileTypeVersion.Version> list = fc.Files.Find(p => p.Method == valueMethod && p.fileType == selectedFileType).Versions;
            FileTypeVersion.Version version = list[index];

            bool exist = version.Columns.Count != 0;
            List<FieldVersionDetail> retList = new List<FieldVersionDetail>();
            if (exist)
            {
                foreach (var v in list[index].Columns)
                {
                    FieldVersionDetail obj = new FieldVersionDetail();
                    obj.FieldName = v.ColumnName;
                    obj.FieldLength = v.ColumnLength;

                    retList.Add(obj);
                }
            }
            return retList;
        }

        public void InsertFieldVersionDetail(string selectedPlatform, string selectedVersion, int index, string name, string length)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();

            string selectedFileType = selectedPlatform;
            VersionDeterminationMethods valueMethod = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);

            FileTypeVersion.Version ver = fc.Files.Find(p => p.Method == valueMethod && p.fileType == selectedFileType).Versions[index];
           
            Column col = new Column();
            col.ColumnName = name;
            col.ColumnLength = length;

            ver.Columns.Add(col);
            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(fc.GetType(), fc);

            string logString = "VersionName:" + ver.VersionName + "|" +
                  "ColumnName:" + col.ColumnName + "|" +
                  "ColumLenght:" + col.ColumnLength;

            WriteLog("INSERT", "MED Configuration", "FileColumns.Columns", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
        }

        public void DeleteFieldVersionDetail(string selectedPlatform, string selectedVersion, int index, int detailIndex)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();
            string selectedFileType = selectedPlatform;
            VersionDeterminationMethods valueMethod = (VersionDeterminationMethods)Enum.Parse(typeof(VersionDeterminationMethods), selectedVersion);
            var version = fc.Files.Find(p => p.Method == valueMethod && p.fileType == selectedFileType).Versions[index];
            var columns = version.Columns;

            string logString = "FileType:" + selectedPlatform + "|" +
                              "VersionMethod:" + selectedVersion + "|" +
                              "VersionName:" + version.VersionName + "|" +
                              "ColumnName:" + columns[index].ColumnName + "|" +
                              "ColumnLength:" + columns[index].ColumnLength;
            WriteLog("DELETE", "MED Configuration", "FileControl.Column", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");

            columns.RemoveAt(detailIndex);

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(fc.GetType(), fc);
        }

        public List<string> GetInputList(string platform, string version)
        {
            FileColumns fc = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FileColumns>();
            var input = fc.Files.Find(p => p.fileType == platform).Versions.Find(g => g.VersionName == version).Columns;
            List<string> list = new List<string>();
            list.Add("None");
            foreach (var i in input)
            {
                list.Add(i.ColumnName);
            }
            return list;
        }

        public List<string> GetOutputList()
        {
            OutputFields of = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<OutputFields>();
            var output = of.OutputFieldsList;

            return output;
            //Output.DataBind();
        }

        public void Map(string platform, string inputField, string transform, string outputField)
        {
                MappingInputToOutput map = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MappingInputToOutput>();
                bool exist = map.Mappings.Exists(p => p.FileType == platform);
                List<FieldMapping> mappings;
                if (exist)
                {
                    mappings = map.Mappings.Find(p => p.FileType == platform).FieldMappings;
                }
                else
                {
                    mappings = new List<FieldMapping>();
                }

                FieldMapping fieldMap = new FieldMapping();

                List<string> inputList = new List<string>();
                string[] inp = inputField.Remove(inputField.Length - 1).Split(';');
                foreach (string i in inp)
                {
                    if (i == "None")
                    {
                        inputList.Add("");
                    }
                    else
                    {
                        inputList.Add(i);
                    }


                }
                fieldMap.InputField = inputList;

                List<Transformation> transList = new List<Transformation>();
                string[] tran = transform.Remove(transform.Length - 1).Split(';');
                foreach (string s in tran)
                {
                    Transformation transformation = new Transformation();
                    string[] tranParam = s.Remove(s.Length - 1, 1).Split('(');
                    if (tranParam.Length > 1)
                    {
                        transformation.Parameter = tranParam[1];
                    }
                    else
                    {
                        transformation.Parameter = "";
                    }
                    if (tranParam[0] != "None")
                    {
                        transformation.TransformationName = tranParam[0];
                    }
                    else
                    {
                        transformation.TransformationName = "";
                    }
                    transList.Add(transformation);
                }
                fieldMap.TransformationList = transList;

                fieldMap.OutputField = outputField;
                mappings.Add(fieldMap);
                if (!exist)
                {
                    Mapping mapping = new Mapping();
                    mapping.FieldMappings = mappings;
                    mapping.FileType = platform;
                    map.Mappings.Add(mapping);

                }

                string logString = "FileType:" + platform + "|" +
                  "InputFields:" + inputList + "|" +
                  "Transformation:" + transList + "|" +
                  "OutputField:" + outputField;
                WriteLog("INSERT", "MED Configuration", "MappingInputToOutput", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");
                FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(map.GetType(), map);
            }

        public void DeleteMapping(string platform, int index)
        {
            MappingInputToOutput map = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MappingInputToOutput>();
            string selectedFileType = platform;
            var fieldMappings = map.Mappings.Find(p => p.FileType == selectedFileType).FieldMappings;
            string[] inputFields = fieldMappings[index].InputField.ToArray();
            var transf = fieldMappings[index].TransformationList;
            string input = "";
            string transformations = "";
            foreach (string i in inputFields)
            {
                input += i;
            }
            foreach (var t in transf)
            {
                transformations += t.Parameter + "(" + t.Parameter + ")";
            }

            string logString = "FileType:" + selectedFileType + "|" +
                              "InputFields:" + input + "|" +
                              "Transformations:" + transformations + "|" +
                              "OutputFied:" + fieldMappings[index].OutputField;
            WriteLog("DELETE", "MED Configuration", "MappingInputToOutput", System.Security.Principal.WindowsIdentity.GetCurrent().Name, logString, "");

            fieldMappings.RemoveAt(index);

            FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.SaveConfiguration(map.GetType(), map);
        }

        public List<MappingGetReq> GetMappings(string platform)
        {
            DataTable dtMapper = new DataTable();
            dtMapper.Columns.Add("InputField");
            dtMapper.Columns.Add("Transformation");
            dtMapper.Columns.Add("OutputField");

            MappingInputToOutput map = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MappingInputToOutput>();
            bool exist = map.Mappings.Exists(p => p.FileType == platform);
            List<FieldMapping> mappings = new List<FieldMapping>();
            if (exist)
            {
                mappings = map.Mappings.Find(p => p.FileType == platform).FieldMappings;
            }

            List<MappingGetReq> mapList = new List<MappingGetReq>();
            foreach (var m in mappings)
            {
                MappingGetReq obj = new MappingGetReq();
                string inputString = "";
                string transformationString = "";

                foreach (string i in m.InputField)
                {
                    inputString += i + ";";
                }
                foreach (var t in m.TransformationList)
                {
                    transformationString += t.TransformationName + "(" + t.Parameter + ");";
                }
                obj.InputField = inputString.Remove(inputString.Length - 1, 1);
                obj.Transformation = transformationString.Remove(transformationString.Length - 1, 1);
                obj.OutputField = m.OutputField;
                mapList.Add(obj);
            }
            return mapList;
        }

        /* Helper methods */
        private static bool IsDateValid(DateTime dateFrom, DateTime dateTo, List<FileTypeVersion.Version> versionList)
        {
            bool validDate = true;
            foreach (var version in versionList)
            {
                DateTime currentDateFrom = dateFrom;
                DateTime currentDateTo = dateTo;
                DateTime versionDateFrom = Convert.ToDateTime(version.VersionStartDate, System.Globalization.CultureInfo.GetCultureInfo("bs-Latn-BA").DateTimeFormat);
                DateTime versionDateTo = Convert.ToDateTime(version.VersionEndDate, System.Globalization.CultureInfo.GetCultureInfo("bs-Latn-BA").DateTimeFormat);

                //if (!(currentDateTo < versionDateFrom) && !(currentDateFrom > versionDateTo))
                //{
                //    validDate = false;
                //    break;
                //}

                if (currentDateFrom <= versionDateTo)
                {
                    validDate = false;
                    break;
                }
            }
            return validDate;
        }
    }
}
