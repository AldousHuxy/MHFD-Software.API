import type { Report } from '../types/report';
import parseCorrespondence from './parseCorrespondence';

export const parseReport = (text: string): Report[] => {
    let currentPage: string[] = [];
    const textArray: string[] = text.split('\n').filter(line => line !== '');
    const pages: string[][] = [];
    const projects: Report[] = [];
    let correspondence: Record<string, string> = {};
    
    for (let i = 0; i < textArray.length; i++) {
        const line = textArray[i];
        if (line !== undefined) {
            const match = line.match(/-- \d+ of \d+ --/);
            if (match) {
                currentPage.push(line);
                pages.push(currentPage);
                currentPage = [];
            } else {
                currentPage.push(line);
            }
        }
    }
    
    if (currentPage.length > 0) {
        pages.push(currentPage);
    }
    for (const page of pages) {
        const [projectName, caseNumber] = page[0]?.split(' Case No.: ') || ['', ''];
        const caseNo = caseNumber?.replace('\tProject ID:', '') || ''
        
        
        const existingProject = projects.find(p => p.projectId === projectName?.trim() && p.caseNum === caseNo?.trim());
        
        if (!existingProject) {
            const hasCorrespondence = page.includes('Correspondence Information');
            const [lomcType, date] = page[2]?.split('\t') || ['', ''];
            const dueDateLine = page[3]?.includes(' Projected Due Date:') ? page[3]?.replace(' Projected Due Date:', '').split(' ') : undefined;
            const [group, projectStatus] = page[6]?.split(' Project Status: ') || ['', ''];
            const orgLine = page[7];
            const communityInfoIndex = page.findIndex(line => line.includes('Community Information'));
            const floodSourceIndex = page.findIndex(line => line.includes('Flood Source Information'));
            const rawCommunityInfo = page.slice(communityInfoIndex + 2, floodSourceIndex);
            const parsedCommunityInfo = rawCommunityInfo.map(line => line.split('\t')
                .map(part => part.replace(', CITY OF', '')
                .replace(', CITY AND COUNTY OF', '')
                .replace('County', '')
                .replace('*', '')
                .replace('CO 8', '').trim()));

            // change all cities to lowercase then capitalize first letter of each word
            const cities: string[] = parsedCommunityInfo.map(info => info[0]?.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) || '');
            const communityIds: string[] = parsedCommunityInfo.map(info => info[1] || '');
            const counties: string[] = parsedCommunityInfo.map(info => info[2] || '');
            // get unique counties only
            const uniqueCounties = Array.from(new Set(counties));


            if (hasCorrespondence) {
                const correspondenceIndex = page.findIndex(line => line.includes('Correspondence Information'));
                const additionalDataRequestsIndex = page.findIndex(line => line.includes('Additional Data Requests'));
                const rawCorrespondenceInfo = page.slice(correspondenceIndex + 2, additionalDataRequestsIndex);

                const notCorrespondenceFields = [
                    'Date',
                    'Project Workflow Information',
                    'Workflow Process Step',
                    'Actual Completion Date',
                    'Administer Fee',
                    'Assign Project Resource',
                    'Review Data Received',
                    'Process Request',
                    'Receive Additional Data',
                    'Review Data Received',
                    'Process Request',
                    'Receive Additional Data',
                    'Review Data Received',
                ]

                const correspondenceInfo = rawCorrespondenceInfo.filter(line => {
                    for (const field of notCorrespondenceFields) {
                        if (line.includes(field)) {
                            return false;
                        }
                    }
                    return true;
                });

                correspondence = parseCorrespondence(correspondenceInfo);
            }
            let projectDueDate = '';
            if (dueDateLine) {
                for (const part of dueDateLine) {
                    if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(part)) {
                        projectDueDate = dueDateLine.pop() || '';
                        break;
                    }
                }
            }
            projects.push({
                projectId: projectName?.trim() || '',
                caseNum: caseNo?.trim() || '',
                received: date || '',
                type: lomcType?.replace('Case Received Date: ', '') || '',
                analystOrEngineer: dueDateLine?.join(' ') || '',
                dueDate: projectDueDate || undefined,
                workGroup: group?.replace('Project Work Group: ', '') || '',
                status: projectStatus || '',
                organization: orgLine?.replace('Organization Name: ', '') || '',
                cities,
                communityIds,
                counties: uniqueCounties,
                correspondence,
            });

            continue;
        }
    }

    return projects;
}