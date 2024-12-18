# X (Twitter) DM Reader Implementation Plan

## Prerequisites

1. X Developer Account
2. X Project with Elevated Access
3. OAuth 2.0 Authentication
4. n8n instance

## API Authentication Setup

1. Create a X Developer App at developer.twitter.com
2. Required permissions:
   - `dm.read`
   - `users.read`
   - `tweet.read`
3. Generate OAuth 2.0 credentials:
   - Client ID
   - Client Secret
   - Bearer Token

## X API Endpoints

We'll use the following endpoints:

1. Get DMs List:

GET https://api.twitter.com/2/dm_conversations/with/{participant_id}/dm_events

2. Get DM Events:

GET https://api.twitter.com/2/dm_events

## n8n Workflow Implementation

### 1. Initial Setup

- Create new n8n workflow
- Add HTTP Request node for OAuth authentication
- Store credentials securely in n8n

### 2. DM Fetching Workflow

#### a. Trigger Node

- Use Schedule Trigger (Cron)
- Set to run every 5-15 minutes
- Configure to avoid rate limits (50 requests/15-min window)

#### b. HTTP Request Node (Get DMs)

javascript
{
"url": "https://api.twitter.com/2/dm_events",
"method": "GET",
"headers": {
"Authorization": "Bearer {{$node.credentials.bearer_token}}",
"Content-Type": "application/json"
},
"params": {
"max_results": 50,
"event_types": "MessageCreate",
"dm_event.fields": "id,text,created_at,sender_id,dm_conversation_id"
}
}

#### c. Function Node (Process DMs)

javascript
return items.map(item => ({
json: {
message_id: item.json.id,
sender_id: item.json.sender_id,
text: item.json.text,
timestamp: item.json.created_at,
conversation_id: item.json.dm_conversation_id
}
}));

### 3. State Management

- Store last processed DM ID
- Use n8n's built-in storage or external database
- Implement pagination for large DM volumes

### 4. Error Handling

- Implement retry logic for failed requests
- Handle rate limiting with exponential backoff
- Log errors for monitoring

## Rate Limits

- 50 requests per 15-minute window
- Maximum 100 DMs per request
- Implement pagination for bulk processing

## Data Storage Considerations

- Only store necessary DM metadata
- Implement data retention policy
- Consider privacy and GDPR compliance

## Security Recommendations

1. Store API credentials securely in n8n
2. Implement IP restrictions if possible
3. Regular token rotation
4. Monitor for suspicious activities

## Testing Plan

1. Test with sample DMs
2. Verify rate limit handling
3. Test error scenarios
4. Validate data processing
5. Check pagination handling

## Next Steps

1. Implement sender credibility check
2. Add AI analysis integration
3. Setup notification system
4. Create monitoring dashboard

## Monitoring

- Track API usage
- Monitor rate limits
- Log processing errors
- Track workflow performance

This implementation focuses on reliable DM fetching while respecting X's rate limits and ensuring proper error handling. The workflow can be extended with additional nodes for credibility checking and AI analysis as per the PRD requirements.
