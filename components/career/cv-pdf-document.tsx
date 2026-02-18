"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CvData, CvEducation } from "@/src/lib/career/cv-data";
import type { CareerPosition, InternalProject } from "@/src/lib/career/career-data";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 56,
    paddingRight: 56,
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  nameBlock: {
    textAlign: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  contactLine: {
    fontSize: 10,
    color: "#444444",
    marginTop: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: "#111111",
    marginBottom: 10,
  },
  educationEntry: {
    marginBottom: 8,
  },
  educationDegree: {
    fontFamily: "Helvetica-Bold",
  },
  educationMeta: {
    fontSize: 10,
    color: "#555555",
  },
  positionEntry: {
    marginBottom: 10,
  },
  positionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  positionCompany: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  positionDateRange: {
    fontSize: 10,
    color: "#555555",
  },
  positionRole: {
    fontSize: 11,
    fontFamily: "Helvetica-Oblique",
    color: "#333333",
    marginTop: 1,
  },
  positionDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#333333",
    marginTop: 3,
  },
  projectEntry: {
    marginTop: 4,
    marginLeft: 12,
  },
  projectBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletChar: {
    width: 10,
    fontSize: 10,
  },
  projectContent: {
    flex: 1,
  },
  projectName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  projectStack: {
    fontSize: 9,
    color: "#555555",
    fontFamily: "Helvetica-Oblique",
  },
  projectDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#333333",
    marginTop: 1,
  },
  stackSection: {
    marginBottom: 10,
  },
  stackRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  stackCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    width: 72,
  },
  stackItems: {
    fontSize: 10,
    flex: 1,
    color: "#222222",
  },
});

function ProjectBullet({ project }: { project: InternalProject }): React.ReactElement {
  return (
    <View style={styles.projectEntry}>
      <View style={styles.projectBulletRow}>
        <Text style={styles.bulletChar}>•</Text>
        <View style={styles.projectContent}>
          <Text style={styles.projectName}>
            {project.name}
            <Text style={styles.projectStack}>
              {" \u2014 "}{project.stack.join(", ")}
            </Text>
          </Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
        </View>
      </View>
    </View>
  );
}

function PositionEntry({ position }: { position: CareerPosition }): React.ReactElement {
  return (
    <View style={styles.positionEntry} wrap={false}>
      <View style={styles.positionHeader}>
        <Text style={styles.positionCompany}>{position.company}</Text>
        <Text style={styles.positionDateRange}>{position.dateRange}</Text>
      </View>
      <Text style={styles.positionRole}>{position.role}</Text>
      {position.location !== undefined ? (
        <Text style={styles.positionDateRange}>{position.location}</Text>
      ) : null}
      <Text style={styles.positionDescription}>{position.description}</Text>
      {position.projects !== undefined && position.projects.length > 0 ? (
        <View>
          {position.projects.map((project: InternalProject) => (
            <ProjectBullet key={project.name} project={project} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

interface CvPdfDocumentProps {
  readonly data: CvData;
}

export function CvPdfDocument({ data }: CvPdfDocumentProps): React.ReactElement {
  return (
    <Document
      title={`CV - ${data.name}`}
      author={data.name}
      subject="Curriculum Vitae"
      language="es-ES"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.contactLine}>
            {data.jobTitle} · {data.socialLinks.linkedin} · {data.socialLinks.github}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Perfil</Text>
        <Text style={styles.summaryText}>{data.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Educación</Text>
        {data.education.map((edu: CvEducation) => (
          <View key={edu.degree} style={styles.educationEntry}>
            <Text style={styles.educationDegree}>{edu.degree}</Text>
            <Text style={styles.educationMeta}>
              {edu.institution} · {edu.location} · {edu.dateRange}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
        {data.positions.map((position: CareerPosition) => (
          <PositionEntry key={`${position.company}-${position.dateRange}`} position={position} />
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Stack Técnico</Text>
        <View style={styles.stackSection}>
          <View style={styles.stackRow}>
            <Text style={styles.stackCategory}>Backend</Text>
            <Text style={styles.stackItems}>{data.technicalStack.backend.join(" · ")}</Text>
          </View>
          <View style={styles.stackRow}>
            <Text style={styles.stackCategory}>Frontend</Text>
            <Text style={styles.stackItems}>{data.technicalStack.frontend.join(" · ")}</Text>
          </View>
          <View style={styles.stackRow}>
            <Text style={styles.stackCategory}>DevOps</Text>
            <Text style={styles.stackItems}>{data.technicalStack.devops.join(" · ")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
