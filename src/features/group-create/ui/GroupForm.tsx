"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import {
  GROUP_STORE_LABEL,
  type GroupStore,
} from "@/entities/group";
import type { CreateGroupBody } from "@/shared/api";

const STORES: GroupStore[] = ["costco", "traders"];

export type GroupFormInitial = {
  productName?: string;
  store?: GroupStore | null;
  branch?: string | null;
  targetCount?: number;
  pricePerPerson?: number | null;
  location?: string;
  meetAt?: string; // ISO string
  description?: string | null;
};

type Props = {
  initial?: GroupFormInitial;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (body: CreateGroupBody) => void;
};

function isoToLocalInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(local: string): string {
  if (!local) return "";
  return new Date(local).toISOString();
}

export function GroupForm({ initial, submitLabel, isSubmitting, onSubmit }: Props) {
  const [productName, setProductName] = useState(initial?.productName ?? "");
  const [store, setStore] = useState<GroupStore | "">(initial?.store ?? "");
  const [branch, setBranch] = useState(initial?.branch ?? "");
  const [targetCount, setTargetCount] = useState<number>(initial?.targetCount ?? 2);
  const [pricePerPerson, setPricePerPerson] = useState<string>(
    initial?.pricePerPerson != null ? String(initial.pricePerPerson) : "",
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [meetAtLocal, setMeetAtLocal] = useState<string>(isoToLocalInput(initial?.meetAt));
  const [description, setDescription] = useState(initial?.description ?? "");

  const canSubmit =
    productName.trim().length > 0 &&
    location.trim().length > 0 &&
    meetAtLocal.length > 0 &&
    targetCount >= 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    const body: CreateGroupBody = {
      productName: productName.trim(),
      targetCount,
      location: location.trim(),
      meetAt: localInputToIso(meetAtLocal),
    };
    if (store) body.store = store;
    if (branch.trim()) body.branch = branch.trim();
    if (pricePerPerson.trim()) body.pricePerPerson = Number(pricePerPerson);
    if (description.trim()) body.description = description.trim();
    onSubmit(body);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-5 py-4 pb-32">
      {/* 상품명 */}
      <Field label="상품명" required>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="예: 커클랜드 닭가슴살 2.27kg"
          maxLength={60}
        />
      </Field>

      {/* 매장 / 지점 */}
      <Field label="매장">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <button
            type="button"
            onClick={() => setStore("")}
            className={cn(
              "h-10 rounded-[10px] font-medium text-body2 transition-colors",
              store === "" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600",
            )}
          >
            선택안함
          </button>
          {STORES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStore(s)}
              className={cn(
                "h-10 rounded-[10px] font-medium text-body2 transition-colors",
                store === s ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600",
              )}
            >
              {GROUP_STORE_LABEL[s]}
            </button>
          ))}
        </div>
        <Input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="지점 (예: 양재점)"
        />
      </Field>

      {/* 모집 인원 */}
      <Field label="모집 인원" required>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTargetCount((n) => Math.max(2, n - 1))}
            className="size-11 rounded-full bg-gray-100 flex items-center justify-center font-bold text-h2 text-gray-700"
            aria-label="인원 감소"
          >
            −
          </button>
          <span className="flex-1 text-center font-bold text-h2 text-gray-900">
            {targetCount}명
          </span>
          <button
            type="button"
            onClick={() => setTargetCount((n) => Math.min(20, n + 1))}
            className="size-11 rounded-full bg-gray-100 flex items-center justify-center font-bold text-h2 text-gray-700"
            aria-label="인원 증가"
          >
            +
          </button>
        </div>
      </Field>

      {/* 1인당 가격 */}
      <Field label="1인당 가격">
        <Input
          type="number"
          inputMode="numeric"
          value={pricePerPerson}
          onChange={(e) => setPricePerPerson(e.target.value)}
          placeholder="예: 7000 (원)"
        />
      </Field>

      {/* 약속 장소 */}
      <Field label="약속 장소" required>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="예: 양재역 1번 출구"
        />
      </Field>

      {/* 약속 시각 */}
      <Field label="약속 시각" required>
        <input
          type="datetime-local"
          value={meetAtLocal}
          onChange={(e) => setMeetAtLocal(e.target.value)}
          className="w-full h-11 rounded-[10px] bg-white border border-gray-300 px-3 text-body2 text-gray-900 outline-none"
        />
      </Field>

      {/* 상세 설명 */}
      <Field label="상세 설명">
        <Textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="모집 조건, 거래 방식 등을 자유롭게 적어주세요."
          rows={5}
          maxLength={500}
        />
      </Field>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button type="submit" variant="primary" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "등록 중…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-body2 text-gray-800">
        {label}
        {required && <span className="text-secondary-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
