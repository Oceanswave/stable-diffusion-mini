import { FormEvent, FunctionComponent, useState } from 'react'

export const SDInput: FunctionComponent = () => {
  const [prompt, setPrompt] = useState<string>('cutest owl on the planet');
  const [promptScale, setPromptScale] = useState<number>(5);
  const [databaseName, setDatabaseName] = useState<string>('pokemon');
  const [numDatabaseResults, setNumDatabaseResults] = useState<number>(10);
  const [numGenerations, setNumGenerations] = useState<number>(1);
  const [height, setHeight] = useState<number>(768);
  const [width, setWidth] = useState<number>(768);
  const [steps, setSteps] = useState<number>(50);
  const [imageData, setImageData] = useState<string | string[]>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = "api/predictions";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        "input": {
          "prompt": prompt,
          "prompt_scale": promptScale,
          "database_name": databaseName,
          "num_database_results":numDatabaseResults,
          "num_generations": numGenerations,
          "height": height,
          "width": width,
          "steps": steps
        }
      }),
    };

    setIsProcessing(true);
    const result = await fetch(url, options);
    const json = await result.json()
    if (json.status === "succeeded") {
      setImageData(json.output);
    }
    setIsProcessing(false);
  }

  return (
    <div>
      <form className="mb-2" onSubmit={submitRequest}>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Prompt</span>
            </label>
            <div className="mt-1">
              <input type="text" placeholder="model will try to generate this text..." className="input w-full max-w-x" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </div>
            <label>
              <span className="label-text">model will try to generate this text</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Prompt Scale</span>
            </label>
            <div className="mt-1">
              <input className="input w-20" type="number" value={promptScale} onChange={e => setPromptScale(parseInt(e.target.value))} />
              <input className="range" type="range" min="1" max="10" value={promptScale} onChange={e => setPromptScale(parseInt(e.target.value))} step={1}/>
              <div className="w-full flex justify-between text-xs px-2">
                {[...Array(10)].map((e, i) => <span key={i}>|</span>) }
              </div>
            </div>
            <label>
              <span className="label-text">Determines influence of the prompt on the generated image. Going above 5.0 is likely to cause artifacting.</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Database Name</span>
            </label>
            <div className="mt-1">
            <select className="select select-bordered" value={databaseName} onChange={e => setDatabaseName(e.target.value)}>
              <option>laion-aesthetic</option>
              <option>simulacra</option>
              <option>prompt-engineer</option>
              <option>pokemon</option>
            </select>
            </div>
            <label>
              <span className="label-text">Which database to use for the semantic search. Different databases have different capabilities.</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Database Results</span>
            </label>
            <div className="mt-1">
              <input type="number" className="input w-20" value={numDatabaseResults} onChange={e => setNumDatabaseResults(parseInt(e.target.value))} />
              <input type="range" min="1" max="20" value={numDatabaseResults} onChange={e => setNumDatabaseResults(parseInt(e.target.value))} className="range" />
            </div>
            <label>
              <span className="label-text">The number of search results to guide the generation with. Using more will 'broaden' capabilities of the model at the risk of causing mode collapse or artifacting. (minimum: 1; maximum: 20)</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Generations</span>
            </label>
            <div className="mt-1">
              <input type="number" className="input w-20" value={numGenerations} onChange={e => setNumGenerations(parseInt(e.target.value))} />
            </div>
            <label>
              <span className="label-text">Number of images to generate. Using more will make generation take longer</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">height</span>
            </label>
            <div className="mt-1">
              <input type="number" className="input w-20" value={height} onChange={e => setHeight(parseInt(e.target.value))} />
            </div>
            <label>
              <span className="label-text">Desired height of generated images</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">width</span>
            </label>
            <div className="mt-1">
              <input type="number" className="input w-20" value={width} onChange={e => setWidth(parseInt(e.target.value))} />
            </div>
            <label>
              <span className="label-text">Desired width of generated images</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">steps</span>
            </label>
            <div className="mt-1">
              <input type="number" className="input w-20" value={steps} onChange={e => setSteps(parseInt(e.target.value))} />
            </div>
            <label>
              <span className="label-text">How many steps to run the model for. Using more will make generation take longer. 50 tends to work well.</span>
            </label>
          </div>
        </div>
        <div className="mb-2">
          {!isProcessing &&
            <button className="btn" type="submit">Submit</button>
          }
        </div>
      </form>
      <div className="mb-2">
        {isProcessing && <progress className="progress w-56"></progress>}
        {!isProcessing && imageData && !Array.isArray(imageData)&& <img src={imageData} alt={prompt} />}
        {!isProcessing && imageData && Array.isArray(imageData) && imageData.map((image, i) => <img key={i} src={image} alt={prompt} />)}
      </div>
    </div>
  )
}