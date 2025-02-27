import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { memo } from 'react';

// Register fonts (using same font family for consistency)
Font.register({
    family: 'EBGaramond',
    fonts: [
        { src: '/fonts/EB_Garamond/static/EBGaramond-Regular.ttf' },
        { src: '/fonts/EB_Garamond/static/EBGaramond-Bold.ttf', fontWeight: 700 },
        { src: '/fonts/EB_Garamond/static/EBGaramond-Italic.ttf', fontStyle: 'italic' }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: 'white'
    },
    header: {
        marginBottom: 30
    },
    headerName: {
        fontSize: 32,
        fontFamily: 'EBGaramond',
        marginBottom: 8,
        color: '#333333'
    },
    headerContact: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        color: '#666666',
        marginBottom: 4
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'EBGaramond',
        marginBottom: 20,
        color: '#333333'
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'EBGaramond',
        fontWeight: 700,
        marginBottom: 12,
        marginTop: 20,
        color: '#333333'
    },
    summaryText: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        lineHeight: 1.6,
        color: '#444444'
    },
    workEntry: {
        marginBottom: 20
    },
    workHeader: {
        marginBottom: 6
    },
    workTitle: {
        fontSize: 12,
        fontFamily: 'EBGaramond',
        fontWeight: 700,
        color: '#333333'
    },
    workCompany: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        color: '#666666'
    },
    workDate: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        color: '#666666',
        marginBottom: 4
    },
    achievementContainer: {
        flexDirection: 'row',
        marginTop: 4,
        paddingLeft: 8
    },
    bulletPoint: {
        width: 15,
        fontSize: 11,
        fontFamily: 'EBGaramond',
        color: '#666666'
    },
    achievementText: {
        flex: 1,
        fontSize: 11,
        fontFamily: 'EBGaramond',
        lineHeight: 1.5,
        color: '#444444'
    },
    skillCategory: {
        marginBottom: 10
    },
    skillCategoryName: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        fontWeight: 700,
        marginBottom: 4,
        color: '#333333'
    },
    skillList: {
        fontSize: 11,
        fontFamily: 'EBGaramond',
        color: '#444444',
        lineHeight: 1.5
    }
});

const HeaderSection = memo(({ personal }) => (
    <View style={styles.header}>
        <Text style={styles.headerName}>
            {`${personal?.fullName || ''}`}
        </Text>
        <Text style={styles.headerTitle}>
            {personal?.title || ''}
        </Text>
        <Text style={styles.headerContact}>
            {`${personal?.location || ''} • ${personal?.email || ''} • ${personal?.phone || ''}`}
        </Text>
    </View>
));


HeaderSection.displayName = 'HeaderSection';



const SummarySection = memo(({ summary }) => {
    <View style={styles.section}>
    <Text style={styles.sectionTitle}>Professional Summary</Text>
    {summary?.trim() && (
      <>
        <View style={styles.divider} />
        <Text style={styles.summaryText}>{summary}</Text>
      </>
    )}
  </View>
});
SummarySection.displayName = 'SummarySection';

const WorkEntry = memo(({ job }) => (
    <View style={styles.workEntry}>
        <View style={styles.workHeader}>
            <Text style={styles.workTitle}>{job.position?.toUpperCase() || ''}</Text>
            <Text style={styles.workDate}>
                {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : ''}
            </Text>
        </View>
        <View style={styles.workHeader}>
            <Text style={styles.workCompany}>{job.company || ''}</Text>
            <Text style={styles.workCompany}>{job.location || ''}</Text>
        </View>
        {job.achievements?.map((achievement, i) => (
            achievement?.trim() ? (
                <View key={i} style={styles.achievementContainer}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.achievementText}>{achievement}</Text>
                </View>
            ) : null
        ))}
    </View>
));
WorkEntry.displayName = 'WorkEntry';

const WorkSection = memo(({ work }) => {
    if (!work?.length) return null;

    const hasContent = work.some(entry =>
        entry.position?.trim() ||
        entry.company?.trim() ||
        entry.achievements?.some(a => a?.trim())
    );

    if (!hasContent) return null;

    return (
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {work?.length > 0 && (
          <>
            <View style={styles.divider} />
            {work.map((job, index) => (
              <WorkEntry key={index} job={job} />
            ))}
          </>
        )}
      </View>
    );
});
WorkSection.displayName = 'WorkSection';

const EducationSection = memo(({ education }) => {
    if (!education?.length) return null;

    return (
        <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
                <View key={index} style={styles.workEntry}>
                    <View style={styles.workHeader}>
                        <Text style={styles.workTitle}>{edu.degree}</Text>
                        <Text style={styles.workDate}>{`${edu.startDate} - ${edu.endDate}`}</Text>
                    </View>
                    <View style={styles.workHeader}>
                        <Text style={styles.workCompany}>{edu.institution}</Text>
                        <Text style={styles.workCompany}>{edu.location}</Text>
                    </View>
                    {edu.description?.map((point, i) => (
                        point?.trim() ? (
                            <View key={i} style={styles.achievementContainer}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.achievementText}>{point}</Text>
                            </View>
                        ) : null
                    ))}
                </View>
            ))}
        </View>
    );
});
EducationSection.displayName = 'EducationSection';

const SkillsSection = memo(({ skills }) => {
    if (!skills?.length) return null;

    return (
        <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((category, index) => (
                <View key={index} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryName}>{category.name}</Text>
                    <Text style={styles.skillList}>
                        {category.skills.filter(skill => skill.trim()).join(' • ')}
                    </Text>
                </View>
            ))}
        </View>
    );
});
SkillsSection.displayName = 'SkillsSection';


const PDFTemplate2 = memo(({ data }) => {
    const resume = data.resume;
    const renderedSections = new Set();

    const renderSection = (sectionId) => {
        if (renderedSections.has(sectionId)) {
            return null;
        }
        renderedSections.add(sectionId);

        switch (sectionId) {
            case 'personal':
                return <HeaderSection personal={resume?.personal} />;
            case 'summary':
                return <SummarySection summary={resume?.summary} />;
            case 'work':
                return <WorkSection work={resume?.work} />;
            case 'education':
                return <EducationSection education={resume?.education} />;
            case 'skills':
                return <SkillsSection skills={resume?.skills} />;
            default:
                return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {data.ui.sectionOrder.map((section) => (
                    <View key={`${section.id}-${renderedSections.size}`}>
                        {renderSection(section.id)}
                    </View>
                ))}
            </Page>
        </Document>
    );
});

PDFTemplate2.displayName = 'PDFTemplate2';

export default PDFTemplate2;