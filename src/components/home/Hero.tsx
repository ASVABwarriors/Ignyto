"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full mx-auto mb-[20px] md:mb-[30px]">
      <div className="relative w-full aspect-[21/9] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.15)] bg-transparent">
        <img
          src="/images/banner1.png"
          alt="Ignyto Tutoring Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
