import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { screeningService } from '../../services/screeningService';
import { patientService } from '../../services/patientService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { FundusImage } from '../../components/ui/FundusImage';
import { Printer, Share2, ArrowLeft, Building, User, Calendar, CheckCircle2 } from 'lucide-react';
import type { ScreeningRecord, PatientRecord } from '../../types';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [screening, setScreening] = useState<ScreeningRecord | null>(null);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const scr = await screeningService.getScreeningById(id);
      if (scr) {
        setScreening(scr);
        const p = await patientService.getPatientById(scr.patientId);
        if (p) setPatient(p);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Generating screening report...
      </div>
    );
  }

  if (!screening || !patient) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
        <p className="text-slate-700 font-bold mb-3">Report record not found</p>
        <Link to="/dashboard" className="text-brand-700 font-semibold underline text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Top action toolbar (hidden during print) */}
      <div className="no-print flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('app.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          {(screening.resultCategory === 'REVIEW' || screening.resultCategory === 'PRIORITY') && (
            <button
              type="button"
              onClick={() => navigate(`/referral/new/${screening.id}`)}
              className="px-3 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('report.referPatient')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('report.print')}</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document */}
      <div className="print-page bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-xs space-y-6">
        {/* Official Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b-2 border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              DS
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {t('report.title')}
              </h1>
              <p className="text-xs font-semibold text-brand-800">
                {screening.centreName}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <p className="font-bold text-slate-900">Report ID: REP-{screening.id}</p>
            <p>Date: {new Date(screening.createdAt).toLocaleDateString()}</p>
            <p>Examined by: {screening.healthWorkerName}</p>
          </div>
        </div>

        {/* Patient Demographics Table */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Patient Demographics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Patient Name</span>
              <span className="font-bold text-sm text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Patient ID</span>
              <span className="font-semibold">{patient.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Age / Sex</span>
              <span className="font-semibold">{patient.age} yrs / {patient.sex}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Village</span>
              <span className="font-semibold">{patient.village}</span>
            </div>
          </div>
        </div>

        {/* Retinal Exam & Result Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Fundus Image view */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Retinal Fundus Image ({screening.eye === 'RIGHT' ? 'Right Eye - OD' : 'Left Eye - OS'})
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-300">
              <FundusImage
                src={screening.imageUri}
                alt="Report fundus image"
                size="preview"
                eye={screening.eye}
                allowZoom={false}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Image Quality: {screening.qualityStatus === 'PASS' ? 'Acceptable for Screening' : 'Insufficient'}
            </p>
          </div>

          {/* Assessment Findings */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Screening Assessment
              </h3>
              <StatusBadge status={screening.resultCategory} size="lg" />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                {t('report.recommendedPlan')}
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {screening.resultRecommendation}
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-teal-50/60 p-3 rounded-xl border border-teal-200">
              <div className="font-bold text-brand-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-700" />
                <span>Protocol Decision Support Verified</span>
              </div>
              <p className="text-[11px] text-slate-700">
                Cloud screening verified under national rural eye care protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Sign-off Footer */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
          <div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Note: This report is a decision-support screening record. For specialist referral cases, please report to the designated district hospital ophthalmology unit.
            </p>
          </div>

          <div className="text-center w-48">
            <div className="border-b border-slate-400 h-10 mb-1" />
            <span className="font-bold text-slate-800 block text-xs">
              {screening.healthWorkerName}
            </span>
            <span className="text-[11px] text-slate-500">
              {t('report.signature')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
