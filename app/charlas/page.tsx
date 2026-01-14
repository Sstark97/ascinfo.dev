"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { TalkCard } from "@/components/listings/talk-card"

// Mock data - In Astro, this would come from Content Collections via getCollection('talks')
const talkItems = [
  {
    title: "TDD desde Cero: Primeros Pasos",
    event: "JSDay Canarias",
    date: "15 Mar 2025",
    location: "Las Palmas de Gran Canaria",
    slidesUrl: "https://slides.example.com/tdd",
    videoUrl: "https://youtube.com/watch?v=example",
    tags: ["TDD", "Testing", "Workshop"],
  },
  {
    title: "Arquitectura Hexagonal en el Frontend",
    event: "React Conf Spain",
    date: "22 Nov 2024",
    location: "Madrid, España",
    slidesUrl: "https://slides.example.com/hex-frontend",
    tags: ["React", "Arquitectura", "Frontend"],
  },
  {
    title: "Clean Code: Más Allá de los Nombres",
    event: "Codemotion",
    date: "08 Oct 2024",
    location: "Online",
    slidesUrl: "https://slides.example.com/clean-code",
    videoUrl: "https://youtube.com/watch?v=example2",
    tags: ["Clean Code", "Best Practices"],
  },
  {
    title: "Domain-Driven Design para Equipos Pequeños",
    event: "Software Crafters Canarias",
    date: "12 Jun 2024",
    location: "Tenerife, España",
    slidesUrl: "https://slides.example.com/ddd",
    tags: ["DDD", "Arquitectura"],
  },
]

const allTags = [
  "TDD",
  "Testing",
  "Workshop",
  "React",
  "Arquitectura",
  "Frontend",
  "Clean Code",
  "Best Practices",
  "DDD",
]

export default function CharlasPage() {
  return (
    <ListingGrid
      title="Charlas"
      subtitle="Talks & Events — Conferencias y workshops"
      items={talkItems}
      allTags={allTags}
      getItemTags={(item) => item.tags}
      getSearchableText={(item) => `${item.title} ${item.event}`}
      renderItem={(item) => <TalkCard {...item} />}
      emptyMessage="No se encontraron charlas con esos filtros."
      gridClassName="flex flex-col gap-4"
    />
  )
}
