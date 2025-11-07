import requests
from bs4 import BeautifulSoup
import asyncio
from typing import Dict, Any, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape_linkedin_sync(url: str) -> Dict[str, Any]:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        data = {
            'profile_picture_url': None,
            'headline': None,
            'experience': [],
            'certifications': [],
            'projects': []
        }
        
        try:
            img_tag = soup.find('img', class_=lambda x: x and 'profile' in x.lower() if x else False)
            if not img_tag:
                img_tag = soup.find('img', attrs={'alt': True})
            if img_tag and img_tag.get('src'):
                data['profile_picture_url'] = img_tag['src']
        except Exception as e:
            logger.warning(f"Could not extract profile picture: {e}")
        
        try:
            headline_elem = soup.find('div', class_=lambda x: x and 'headline' in x.lower() if x else False)
            if not headline_elem:
                headline_elem = soup.find('h2', class_=lambda x: x and 'top-card' in x.lower() if x else False)
            if headline_elem:
                data['headline'] = headline_elem.get_text(strip=True)
        except Exception as e:
            logger.warning(f"Could not extract headline: {e}")
        
        logger.info(f"LinkedIn scraping completed for {url}. Note: LinkedIn may require authentication for full data.")
        
        return data
        
    except requests.RequestException as e:
        logger.error(f"LinkedIn scraping failed for {url}: {str(e)}")
        return {
            'profile_picture_url': None,
            'headline': None,
            'experience': [],
            'certifications': [],
            'projects': []
        }
    except Exception as e:
        logger.error(f"LinkedIn scraping failed for {url}: {str(e)}", exc_info=True)
        return {
            'profile_picture_url': None,
            'headline': None,
            'experience': [],
            'certifications': [],
            'projects': []
        }

def scrape_google_scholar_sync(url: str) -> List[Dict[str, Any]]:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        publications = []
        
        try:
            pub_rows = soup.find_all('tr', class_='gsc_a_tr')[:5]
            
            for row in pub_rows:
                title_elem = row.find('a', class_='gsc_a_at')
                authors_elem = row.find('div', class_='gs_gray')
                year_elem = row.find('span', class_='gsc_a_h')
                
                if title_elem:
                    publications.append({
                        'title': title_elem.get_text(strip=True),
                        'authors': authors_elem.get_text(strip=True) if authors_elem else None,
                        'year': year_elem.get_text(strip=True) if year_elem else None,
                        'citation': None
                    })
            
            logger.info(f"Google Scholar scraping completed for {url}. Found {len(publications)} publications.")
        except Exception as e:
            logger.warning(f"Could not extract publications: {e}")
        
        return publications
        
    except requests.RequestException as e:
        logger.error(f"Google Scholar scraping failed for {url}: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Google Scholar scraping failed for {url}: {str(e)}", exc_info=True)
        return []

async def scrape_faculty_data(linkedin_url: str = None, scholar_url: str = None) -> Dict[str, Any]:
    loop = asyncio.get_event_loop()
    
    linkedin_data = {}
    publications = []
    
    if linkedin_url:
        linkedin_data = await loop.run_in_executor(None, scrape_linkedin_sync, linkedin_url)
    
    if scholar_url:
        publications = await loop.run_in_executor(None, scrape_google_scholar_sync, scholar_url)
    
    return {
        'profile_picture_url': linkedin_data.get('profile_picture_url'),
        'headline': linkedin_data.get('headline'),
        'experience': linkedin_data.get('experience', []),
        'certifications': linkedin_data.get('certifications', []),
        'projects': linkedin_data.get('projects', []),
        'publications': publications
    }
